import { ws } from "../../webSocket/ws";
import {
  wsConnected,
  wsMessageReceived,
  wsError,
  redirectToLogin,
  setLoading,
} from "../../features/websocket/websocketServices";
import { refreshToken } from "../../features/auth/authUtils";
import { WebsocketEvent, Websocket } from "websocket-ts";

const playSound = () => {
  const audio = new Audio("/bright-notification-352449.mp3");
  audio.play().catch((err) => console.error("Audio play failed:", err));
};

const createWebSocketMiddleware = () => {
  let socket = null;
  let tokenRefreshTimeoutId = null;
  let refreshing = false;
  let currentGroupId = null;

  // reconnect/backoff controls
  let reconnectAttempts = 0;
  const MAX_RECONNECT_ATTEMPTS = 5;
  let manualClose = false;
  let connecting = false;
  let isConnected = false;
  let pendingMessages = [];

  const getBackoffMs = (attempt) => {
    return Math.min(30000, 500 * 2 ** attempt);
  };

  // Decode JWT
  function parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  // Calculate ms until expiry (30s buffer)
  function msUntilExpiry(token) {
    const payload = parseJwt(token);
    if (!payload || !payload.exp) {
      console.log("Invalid token or missing exp");
      return 0;
    }
    const expiryTimeMs = payload.exp * 1000;
    const now = Date.now();
    return Math.max(expiryTimeMs - now - 30000, 0);
  }

  function scheduleTokenRefresh(store) {
    if (tokenRefreshTimeoutId) {
      clearTimeout(tokenRefreshTimeoutId);
      tokenRefreshTimeoutId = null;
    }
    const accessToken = store.getState().auth.accessToken;
    if (!accessToken) return;
    const waitTime = msUntilExpiry(accessToken);
    console.log("[Middleware] scheduleTokenRefresh: waitTime =", waitTime);
    if (waitTime <= 0) {
      console.log(
        "[Middleware] Token has expired or is near expiry – refreshing now."
      );
      refreshMyToken(store);
    } else {
      tokenRefreshTimeoutId = setTimeout(() => {
        console.log(
          "[Middleware] Token refresh timeout hit, refreshing token."
        );
        refreshMyToken(store);
      }, waitTime);
    }
  }

  async function refreshMyToken(store) {
    if (refreshing) return;
    refreshing = true;
    console.log("[Middleware] 🔄 Refreshing token...");
    try {
      await store.dispatch(refreshToken()).unwrap();
      const state = store.getState();
      const newToken = state.auth.accessToken;
      const currentGroupId = state.chat?.selectedChat?.uid;
      console.log("[Middleware] Token refreshed. New token:", newToken);
      if (socket && currentGroupId && newToken) {
        console.log("[Middleware] 🔁 Reconnecting WS with new token");
        try {
          manualClose = false;
          socket.close();
        } catch (err) {
          console.warn("Error closing old socket:", err);
        }
        store.dispatch({
          type: "WS_CONNECT_CHAT",
          payload: { groupId: currentGroupId },
        });
      }
      scheduleTokenRefresh(store);
    } catch (err) {
      console.error("❌ Failed to refresh token:", err);
      store.dispatch(redirectToLogin());
    } finally {
      refreshing = false;
    }
  }

  return (store) => (next) => async (action) => {
    switch (action.type) {
      case "WS_CONNECT_CHAT": {
        const { groupId } = action.payload;
        if (!groupId) return next(action);

        // Prevent duplicate socket connections for the same group.
        if (
          currentGroupId === groupId &&
          socket &&
          socket.underlyingWebsocket.readyState === WebSocket.OPEN
        ) {
          console.warn(
            "[Middleware] Already connected to this group. Ignoring duplicate connect."
          );
          return next(action);
        }

        // Save the current group id
        currentGroupId = groupId;
        pendingMessages = [];

        // if an existing socket exists, close it first (mark manualClose false so reconnect logic can run)
        // Avoid concurrent connects
        if (connecting) {
          console.warn(
            "[Middleware] Connect requested while already connecting - ignored."
          );
          return next(action);
        }
        // if an existing socket exists, close it first (mark manualClose false so reconnect logic can run)
        if (socket !== null) {
          try {
            manualClose = false;
            socket.close();
          } catch (err) {
            console.warn("Error closing old socket:", err);
          }
          socket = null;
        }

        const state = store.getState();
        const accessToken = state.auth.accessToken;
        const user = state.auth.user;
        if (!accessToken) {
          store.dispatch(redirectToLogin());
          return next(action);
        }

        // Start token watcher
        scheduleTokenRefresh(store);
        store.dispatch(setLoading(true));

        connecting = true;
        socket = await ws(groupId, accessToken);

        if (!socket) {
          store.dispatch(wsError("Failed to create WebSocket instance"));
          store.dispatch(setLoading(false));
          connecting = false;
          return next(action);
        }

        const currentSocket = socket;

        // In websocketMiddleware.js
        currentSocket.addEventListener(WebsocketEvent.open, () => {
          console.log("✅ WS connection open");
          reconnectAttempts = 0;
          manualClose = false;
          connecting = false;
          store.dispatch(wsConnected());
          store.dispatch(setLoading(false));
          isConnected = true;

          // Flush any buffered messages directly over the open socket
          if (pendingMessages.length > 0) {
            pendingMessages.forEach((msg) => {
              currentSocket.send(JSON.stringify(msg));
            });
            pendingMessages = [];
          }
        });

        currentSocket.addEventListener(
          WebsocketEvent.message,
          (i = Websocket, ev = MessageEvent) => {
            try {
              const data = JSON.parse(ev.data);
              // ignore messages from stale socket instances
              if (socket !== currentSocket) return;
              if (data.type && data.sender_id !== user.id) {
                store.dispatch(wsMessageReceived(data));
                playSound();
              }
            } catch (error) {
              store.dispatch(
                wsError(`Failed to parse message: ${error.message}`)
              );
            }
          }
        );

        // Listen for close on the wrapper and ignore if this is a stale socket
        currentSocket.addEventListener(WebsocketEvent.close, (ev) => {
          // ignore close events from sockets that are no longer current
          if (socket !== currentSocket) return;
          console.log(`⚠️ WS connection closed (code: ${ev.code})`);
          isConnected = false;
          // clear any token refresh timer when socket closes
          if (tokenRefreshTimeoutId) {
            clearTimeout(tokenRefreshTimeoutId);
            tokenRefreshTimeoutId = null;
          }

          // If this was a client-initiated/manual disconnect, do nothing
          if (manualClose) {
            socket = null;
            connecting = false;
            return;
          }

          // Token-related close codes: try refresh flow
          if ([4001, 4003, 4401, 401, 403].includes(ev.code) && !refreshing) {
            refreshMyToken(store);
            return;
          }

          // Normal closure (1000) from server: do not immediate reconnect — avoid loops
          if (ev.code === 1000) {
            console.warn(
              "[Middleware] Normal close (1000). Not reconnecting automatically."
            );
            socket = null;
            connecting = false;
            return;
          }

          // For other abnormal closures, attempt reconnect with backoff (bounded attempts)
          if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            const attempt = reconnectAttempts;
            const delay = getBackoffMs(attempt);
            reconnectAttempts += 1;
            console.log(
              `[Middleware] Scheduling reconnect attempt #${reconnectAttempts} in ${delay}ms`
            );
            setTimeout(() => {
              const currentGroupId = store.getState().chat?.selectedChat?.uid;
              if (currentGroupId) {
                store.dispatch({
                  type: "WS_CONNECT_CHAT",
                  payload: { groupId: currentGroupId },
                });
              }
            }, delay);
          } else {
            store.dispatch(
              wsError("WebSocket closed — max reconnect attempts reached")
            );
            socket = null;
            connecting = false;
          }
        });

        currentSocket.addEventListener("error", (event) => {
          store.dispatch(wsError("WebSocket connection error"));
        });

        break;
      }

      case "WS_DISCONNECT_CHAT": {
        // mark as manual close so close handler won't try to reconnect
        manualClose = true;
        reconnectAttempts = 0;
        connecting = false;
        isConnected = false;
        pendingMessages = [];
        if (socket !== null) {
          try {
            socket.close();
          } catch (err) {
            console.warn("Error closing socket on disconnect action:", err);
          }
          socket = null;
        } else {
          console.warn(
            "[Middleware] Attempted to disconnect, but no WebSocket connection was active."
          );
        }

        if (tokenRefreshTimeoutId) {
          clearTimeout(tokenRefreshTimeoutId);
          tokenRefreshTimeoutId = null;
        }
        break;
      }

      case "WS_SEND_MESSAGE": {
        if (socket && isConnected) {
          socket.send(JSON.stringify(action.payload));
        } else {
          console.warn(
            "[Middleware] WebSocket not open. Buffering message for later send."
          );
          pendingMessages.push(action.payload);
        }
        break;
      }

      default:
        break;
    }

    return next(action);
  };
};

export default createWebSocketMiddleware;

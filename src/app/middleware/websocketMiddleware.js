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
    if (waitTime <= 0) {
      refreshMyToken(store);
    } else {
      tokenRefreshTimeoutId = setTimeout(() => refreshMyToken(store), waitTime);
    }
  }

  async function refreshMyToken(store) {
    if (refreshing) return;
    refreshing = true;
    try {
      console.log("🔄 Refreshing token...");
      await store.dispatch(refreshToken()).unwrap(); // ensure Redux updated

      const state = store.getState();
      const newToken = state.auth.accessToken;
      const currentGroupId = state.chat?.selectedChat?.uid;

      if (socket && currentGroupId && newToken) {
        console.log("🔁 Reconnecting WS with new token");
        try {
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
        if (socket !== null) {
          try {
            // 🧹 Remove old listeners
            socket.removeEventListener(WebsocketEvent.open, () => {});
            socket.removeEventListener(WebsocketEvent.message, () => {});
            socket.underlyingWebsocket?.removeEventListener("close", () => {});
            socket.removeEventListener("error", () => {});

            socket.close();
          } catch (err) {
            console.warn("Error cleaning old socket:", err);
          }
          socket = null;
        }

        const { groupId } = action.payload;
        if (!groupId) return next(action);

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

        socket = await ws(groupId, accessToken);

        socket.addEventListener(WebsocketEvent.open, () => {
          console.log("✅ WS connection open");
          store.dispatch(wsConnected());
          store.dispatch(setLoading(false));
        });

        socket.addEventListener(
          WebsocketEvent.message,
          (i = Websocket, ev = MessageEvent) => {
            try {
              const data = JSON.parse(ev.data);
              console.log("data received : ", data);
              
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

        socket.underlyingWebsocket.addEventListener("close", (ev) => {
          console.warn("⚠️ WS closed:", ev.code, ev.reason);

          if ([4001, 4003, 4401, 401, 403].includes(ev.code) && !refreshing) {
            refreshMyToken(store);
          }
        });

        socket.addEventListener("error", (event) => {
          store.dispatch(wsError("WebSocket connection error"));
        });

        break;
      }

      case "WS_DISCONNECT_CHAT": {
        if (socket !== null) {
          socket.close();
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
        if (
          socket &&
          socket.underlyingWebsocket &&
          socket.underlyingWebsocket.readyState === WebSocket.OPEN
        ) {
          socket.send(JSON.stringify(action.payload));
        } else {
          console.warn(
            "[Middleware] WebSocket not open. Message not sent:",
            action.payload
          );
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

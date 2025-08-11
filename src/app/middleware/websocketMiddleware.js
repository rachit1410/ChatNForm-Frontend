import { ws } from '../../webSocket/ws';
import {
  wsConnected,
  wsDisconnected,
  wsMessageReceived,
  wsError,
  redirectToLogin,
  setLoading,
  dynamicRefresh
} from '../../features/websocket/websocketServices';
import { WebsocketEvent, Websocket } from 'websocket-ts';

const playSound = () => {
  const audio = new Audio('/message-recived.mp3');
  audio.play().catch(err => console.error('Audio play failed:', err));
};

const createWebSocketMiddleware = () => {
  let socket = null;
  let tokenRefreshTimeoutId = null;

  // Decode JWT to get expiry
  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  // Calculate ms until expiry minus 30 seconds buffer
  function msUntilExpiry(token) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) {
    console.log("Invalid token or missing exp");
    return 0;
  }
  const expiryTimeMs = payload.exp * 1000;
  const now = Date.now();
  const waitTime = Math.max(expiryTimeMs - now - 30000, 0);
  console.log("Token expires in (ms):", waitTime);
  return waitTime;
}

function scheduleTokenRefresh(store) {
  if (tokenRefreshTimeoutId) {
    clearTimeout(tokenRefreshTimeoutId);
    tokenRefreshTimeoutId = null;
  }
  const accessToken = store.getState().auth.accessToken;
  if (!accessToken) {
    console.log("No access token, skipping refresh schedule");
    return;
  }
  const waitTime = msUntilExpiry(accessToken);
  console.log("Scheduling token refresh in ms:", waitTime);
  if (waitTime <= 0) {
    console.log("Token expired or close to expiry, refreshing immediately");
    refreshToken(store);
  } else {
    tokenRefreshTimeoutId = setTimeout(() => refreshToken(store), waitTime);
  }
}

let refreshing = false;

  // Refresh token by dispatching dynamicRefresh and reschedule watcher
async function refreshToken(store) {
  if (refreshing) return; // skip if already refreshing
  try {
    refreshing = true;
    await store.dispatch(dynamicRefresh());
    scheduleTokenRefresh(store);
  } catch (err) {
    console.error('Failed to refresh token:', err);
  } finally {
    refreshing = false;
  }
}

  return store => next => async action => {
    switch (action.type) {
      case 'WS_CONNECT_CHAT':
        if (socket !== null) {
          socket.close();
          socket = null;
        }

        const { groupId } = action.payload;

        if (!groupId) {
          return next(action);
        }

        const state = store.getState();
        const accessToken = state.auth.accessToken;
        const user = state.auth.user;

        if (!accessToken) {
          store.dispatch(redirectToLogin());
          return next(action);
        }

        // Start token watcher on connect
        scheduleTokenRefresh(store);
        store.dispatch(setLoading(true))
        
        socket = await ws(groupId, accessToken); // Await the WebSocket instance

        socket.addEventListener(WebsocketEvent.open, (i = Websocket, ev = MessageEvent) => {
          console.log('connection open.');
          store.dispatch(wsConnected());
          store.dispatch(setLoading(false))
        });

        socket.addEventListener(WebsocketEvent.message, (i = Websocket, ev = MessageEvent) => {
          try {
            console.log('message received.');
            const data = JSON.parse(ev.data);
            if (data.message.message && data.message.sender_id !== user.id) {
              store.dispatch(wsMessageReceived(data.message));
              playSound();
            }
          } catch (error) {
            store.dispatch(wsError(`Failed to parse message: ${error.message}`));
          }
        });

        socket.addEventListener(WebsocketEvent.close, () => {
          store.dispatch(wsDisconnected());
          socket = null;

          // Clear token watcher on disconnect
          if (tokenRefreshTimeoutId) {
            clearTimeout(tokenRefreshTimeoutId);
            tokenRefreshTimeoutId = null;
          }
        });

        socket.addEventListener('error', async event => {
          console.error('WebSocket error observed:', event);
          store.dispatch(wsError('WebSocket connection error'));
          await refreshToken(store);
        });
        break;

      case 'WS_DISCONNECT_CHAT':
        if (socket !== null) {
          socket.close();
          socket = null;
        } else {
          console.warn('[Middleware] Attempted to disconnect, but no WebSocket connection was active.');
        }

        // Clear token watcher on manual disconnect
        if (tokenRefreshTimeoutId) {
          clearTimeout(tokenRefreshTimeoutId);
          tokenRefreshTimeoutId = null;
        }
        break;

      case 'WS_SEND_MESSAGE':
        if (socket && socket.underlyingWebsocket && socket.underlyingWebsocket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(action.payload));
        } else {
          console.warn('[Middleware] WebSocket not open. Message not sent:', action.payload);
        }
        break;

      default:
        return next(action);
    }

    return next(action);
  };
};

export default createWebSocketMiddleware;

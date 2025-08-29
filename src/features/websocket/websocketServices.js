import api from "../../api/axios"

// Action to initiate WebSocket connection to a chat group
export const connectToChat = (groupId) => ({
  type: 'WS_CONNECT_CHAT',
  payload: { groupId },
});

// Action to disconnect from the current WebSocket chat
export const disconnectFromChat = () => ({
  type: 'WS_DISCONNECT_CHAT',
});

// Action to send a message over the WebSocket
export const sendMessage = (messagePayload) => ({
  type: 'WS_SEND_MESSAGE',
  payload: messagePayload,
});

// Action dispatched when WebSocket connection is successfully opened
export const wsConnected = () => ({
  type: 'WS_CONNECTED',
});

// Action dispatched when WebSocket connection is closed
export const wsDisconnected = () => ({
  type: 'WS_DISCONNECTED',
});

// Action dispatched when a message is received from the WebSocket
export const wsMessageReceived = (message) => ({
  type: 'WS_MESSAGE_RECEIVED',
  payload: message,
});

// Action dispatched on WebSocket error
export const wsError = (error) => ({
  type: 'WS_ERROR',
  payload: error,
});

// --- ADDED ACTIONS FOR REDIRECTION ---
// Action dispatched to signal redirection to the login page
export const redirectToLogin = () => ({
  type: 'REDIRECTTOLOGIN',
});

// Action dispatched to reset the redirection flag
export const resetRedirect = () => ({
  type: 'RESET_REDIRECT',
});
// ------------------------------------

export const clearChatMessages = ()=>({
  type: 'CLEAR_CHAT_MESSSAGES'
});

export const setLoading = (loading) => ({
  type: 'SET_LOADING',
  payload: {loading }
})

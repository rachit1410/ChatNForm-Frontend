import {
  wsConnected,
  wsDisconnected,
  wsMessageReceived,
  wsError,
  redirectToLogin,
  resetRedirect,
  clearChatMessages,
  setLoading
} from './websocketServices';

const initialState = {
  messages: [],
  isConnected: false,
  error: null,
  currentGroupId: null,
  loading: false,
};

const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case wsConnected().type:
     return { ...state, isConnected: true, error: null };
    case wsDisconnected().type:
     return { ...state, isConnected: false, error: null, currentGroupId: null };
    case wsMessageReceived().type:
      return { ...state, messages: [...state.messages, action.payload] };
    case wsError().type:
      return { ...state, error: action.payload, isConnected: false };
    case 'WS_CONNECT_CHAT':
      return { ...state, currentGroupId: action.payload.groupId };
    case clearChatMessages().type:
      return { ...state, messages: [] };
    case 'DYNAMIC_REFRESH':
      return { ...state }
    case redirectToLogin().type:
      return { ...state, shouldRedirectToLogin: true };
    case resetRedirect().type:
      return { ...state, shouldRedirectToLogin: false };
    case setLoading().type:
      return { ...state, loading: action.payload.loading }
    default:
      return state;
 }
};

export default chatReducer;
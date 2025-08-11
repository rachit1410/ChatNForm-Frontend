// src/app/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from '../features/auth/authSlice';
import chatReducer from '../features/chat/chatSlice';
import searchReducer from '../features/search/searchSlice';
import messageReducer from '../features/websocket/websocketSlice';
import createWebSocketMiddleware from './middleware/websocketMiddleware'

// 1. Configuration for redux-persist
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'],
};

// 2. Combine your reducers
const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  search: searchReducer,
  message: messageReducer
});

// 3. Create a persisted reducer using persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

//4. create a websocket middelware
const wsMiddleware = createWebSocketMiddleware();

// 4. Configure the Redux store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware(
      { serializableCheck: { 
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(wsMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

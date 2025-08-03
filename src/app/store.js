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

});

// 3. Create a persisted reducer using persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Configure the Redux store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer here
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

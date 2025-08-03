import { createSlice } from '@reduxjs/toolkit';
import {login, register, verifyOtp, sendOtp, logout, fetchUser} from './authUtils';

const initialState = {
  accessToken: null,
  emailVerified: false,
  email: null,
  user: null,
  error: null,
  loading: false,
  isRegistered: false,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccess: (state, action) => {
      state.accessToken = action.payload;
    },
    clearAuth: (state) => {
      Object.assign(state, initialState);
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
        .addCase(sendOtp.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(sendOtp.fulfilled, (state, action) => {
          if (!action.payload.data.verified){
            state.email = action.payload.email;
            state.emailVerified = false;
          }
          else {
            state.emailVerified = true;
          }
          state.loading = false;
        })
        .addCase(sendOtp.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
        })
        .addCase(verifyOtp.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(verifyOtp.fulfilled, (state) => {
            state.emailVerified = true;
            state.loading = false;
        })
        .addCase(verifyOtp.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })
        .addCase(register.pending, (state) => {
            state.isRegistered = false;
            state.emailVerified = false;
            state.loading = true;
            state.error = null
        })
        .addCase(register.fulfilled, (state, action) => {
          state.isRegistered = true;
        })
        .addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(login.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
          state.accessToken = action.payload.data.access;
          state.loading = false;
          state.isAuthenticated = true;
        })
        .addCase(login.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.isAuthenticated = false;
        })
        .addCase(logout.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(logout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(logout.fulfilled, () => initialState)
        .addCase(fetchUser.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchUser.fulfilled, (state, action) => {
          state.user = action.payload.data.user;
          state.loading = false;
          state.isAuthenticated = true;
        })
        .addCase(fetchUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetch user data';
          state.isAuthenticated = false;
        });

  },
});

export const { setAccess, clearAuth, setError } = authSlice.actions;
export default authSlice.reducer;

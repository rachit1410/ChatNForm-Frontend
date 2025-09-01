import { createSlice } from '@reduxjs/toolkit';
import {login, register, verifyOtp, sendOtp, logout, fetchUser, refreshToken, updateAccount, forgotPassword, verifyOtpCp, changePassword, getWSToken} from './authUtils';


const initialState = {
  accessExpiry: null,
  emailVerified: false,
  email: null,
  user: null,
  error: null,
  loading: false,
  isRegistered: false,
  isAuthenticated: false,
  isOtpCorrect: false,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      Object.assign(state, initialState);
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setLoadState: (state, action) => {
      state.loading = action.payload;
    },
    setAccessExpiry: (state, action) => {
      state.accessExpiry = action.payload;
    },
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
          state.accessExpiry = action.payload.data.accessExpiry;
          state.loading = false;
          state.isAuthenticated = true;
          state.emailVerified = true;
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
          state.isAuthenticated = true
        })
        .addCase(fetchUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetch user data';
          state.isAuthenticated = false;
        })
        .addCase(refreshToken.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(refreshToken.fulfilled, (state, action) => {
            state.accessToken = action.payload.data.access;
            state.loading = false;
        })
        .addCase(refreshToken.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })
        .addCase(getWSToken.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getWSToken.fulfilled, (state, action) => {
            state.token = action.payload.data.token;
            state.loading = false;
        })
        .addCase(getWSToken.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })
        .addCase(updateAccount.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateAccount.fulfilled, (state, action) => {
            state.user = action.payload.data;
            state.loading = false;
        })
        .addCase(updateAccount.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })
        .addCase(forgotPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(forgotPassword.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(forgotPassword.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })
        .addCase(verifyOtpCp.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.isOtpCorrect = false;
        })
        .addCase(verifyOtpCp.fulfilled, (state, action) => {
            state.loading = false;
            state.isOtpCorrect = true;
        })
        .addCase(verifyOtpCp.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })
        .addCase(changePassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(changePassword.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(changePassword.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });
  },
});

export const { clearAuth, setError, setLoadState, setAccessExpiry } = authSlice.actions;
export default authSlice.reducer;

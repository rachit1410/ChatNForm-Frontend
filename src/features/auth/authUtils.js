import { createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authServices';

export const login = createAsyncThunk('auth/login', 
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await authService.login({ email, password });
            if (response.data.status) {
                return response.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const register = createAsyncThunk('auth/register', 
    async ({ email, name, password }, { rejectWithValue }) => {
        try {
            const response = await authService.register({ email, name, password });
            if (response.data.status) {
                return response.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const sendOtp = createAsyncThunk('auth/sendOtp', 
    async (email, { rejectWithValue }) => {
        try {
            
            const response = await authService.sendOtp(email);
            if (response.data.status){
                return response.data;
            }
            else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const verifyOtp = createAsyncThunk('auth/verifyOtp', 
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const response = await authService.verifyOtp(email, otp);
            if (response.data.status) {
                return response.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const refreshToken = createAsyncThunk('auth/refresh', 
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.refreshToken();
            if (response.data.status) {
                return response.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const logout = createAsyncThunk('auth/logout', 
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.logout();
            console.log(response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const fetchUser = createAsyncThunk('auth/fetchUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.fetchUser();
            if (response.data.status) {
                return response.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const updateAccount = createAsyncThunk('auth/update',
    async ({name, profile}, { rejectWithValue }) => {

        const formData = new FormData();
        if (name) {
            formData.append('name', name)
        }
        if (profile && profile instanceof File) {
            formData.append('profile_image', profile)
        }
        try {
            const response = await authService.updateAccount(formData);
            if (response.data.status) {
                return response.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const forgotPassword = createAsyncThunk('auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const response = await authService.forgotPassword(email);
            if (response.data.status) {
                return response.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const verifyOtpCp = createAsyncThunk('auth/verifyOtpCp',
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const response = await authService.verifyOtpCp(email, otp);
            if (response.data.status) {
                return response.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const changePassword = createAsyncThunk('auth/changePassword',
    async ({ email, new_password }, { rejectWithValue }) => {
        try {
            const response = await authService.changePassword({ email, new_password });
            if (response.data.status) {
                return response.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getWSToken = createAsyncThunk('auth/wsToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.getWSToken();
            if (response.data.status) {
                return response.data;
            } else {
                return rejectWithValue(response.data.message);
            }
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import { USER_MOCK_ID } from './mockauth';

import type { AuthResponse, AuthUser, LoginData, RegisterData } from './types';

import { authService } from './authService';

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

type SetAuthPayload = {
  user: AuthUser;
  accessToken: string;
};

const mockUser: AuthUser = {
  id: USER_MOCK_ID,
  name: 'Mock User',
  email: 'mock@example.com',
  registeredAt: new Date().toISOString(),
};

const initialState: AuthState = {
  user: mockUser,
  accessToken: 'mock-access-token',
  isAuthenticated: true,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<SetAuthPayload>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.error = null;
    },

    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },

    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    updateUserName(state, action: PayloadAction<string>) {
      if (!state.user) {
        return;
      }

      state.user.name = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка регистрации';
      })

      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка входа';
      })

      .addCase(refreshAccessTokenThunk.fulfilled, (state, action) => {
        if (!action.payload) {
          state.accessToken = null;
          state.isAuthenticated = false;
          return;
        }

        state.accessToken = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { setAuth, logout, setAuthLoading, setAuthError, updateUserName } = authSlice.actions;

export const authReducer = authSlice.reducer;

export const registerThunk = createAsyncThunk<AuthResponse, RegisterData>(
  'auth/register',
  async (data) => {
    return authService.register(data);
  },
);

export const loginThunk = createAsyncThunk<AuthResponse, LoginData>('auth/login', async (data) => {
  return authService.login(data);
});

export const refreshAccessTokenThunk = createAsyncThunk<string | null>(
  'auth/refreshAccessToken',
  async () => {
    return authService.refreshAccessToken();
  },
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  authService.logout();
});

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { USER_MOCK_ID } from './mockauth';

import type { AuthUser } from './types';

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
});

export const { setAuth, logout, setAuthLoading, setAuthError, updateUserName } = authSlice.actions;

export const authReducer = authSlice.reducer;

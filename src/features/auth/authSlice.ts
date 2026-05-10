import { createSlice } from '@reduxjs/toolkit';

import { USER_MOCK_ID } from './mockauth';

type MockUser = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: MockUser;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: {
    id: USER_MOCK_ID,
    name: 'Mock User',
    email: 'mock@example.com',
  },
  isAuthenticated: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
});

export const authReducer = authSlice.reducer;

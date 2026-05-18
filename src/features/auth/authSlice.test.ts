import { describe, expect, it } from 'vitest';

import { authReducer, logout, setAuth, updateUserName } from './authSlice';
import { USER_MOCK_ID } from './mockauth';

describe('authSlice', () => {
  it('has mock authenticated user by default', () => {
    const state = authReducer(undefined, {
      type: 'unknown',
    });

    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.id).toBe(USER_MOCK_ID);
    expect(state.user?.email).toBe('mock@example.com');
  });

  it('sets auth user and token', () => {
    const state = authReducer(
      undefined,
      setAuth({
        user: {
          id: 'user-2',
          name: 'Test User',
          email: 'test@example.com',
          registeredAt: '2026-01-01T00:00:00.000Z',
        },
        accessToken: 'access-token',
      }),
    );

    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.id).toBe('user-2');
    expect(state.accessToken).toBe('access-token');
  });

  it('logs out user', () => {
    const state = authReducer(undefined, logout());

    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
  });

  it('updates user name', () => {
    const state = authReducer(undefined, updateUserName('Новое имя'));

    expect(state.user?.name).toBe('Новое имя');
  });
});
import { describe, expect, it } from 'vitest';

import { authReducer } from './authSlice';
import { USER_MOCK_ID } from './mockauth';

describe('authSlice', () => {
  it('has mock authenticated user by default', () => {
    const state = authReducer(undefined, {
      type: 'unknown',
    });

    expect(state.isAuthenticated).toBe(true);
    expect(state.user.id).toBe(USER_MOCK_ID);
    expect(state.user.email).toBe('mock@example.com');
  });
});

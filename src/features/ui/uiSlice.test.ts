import { describe, expect, it } from 'vitest';

import { setNotification, setSaveStatus, uiReducer } from './uiSlice';

describe('uiSlice', () => {
  it('sets save status', () => {
    const state = uiReducer(undefined, setSaveStatus('saving'));

    expect(state.saveStatus).toBe('saving');
  });

  it('sets notification', () => {
    const state = uiReducer(undefined, setNotification('Готово'));

    expect(state.notification).toBe('Готово');
  });

  it('clears notification', () => {
    let state = uiReducer(undefined, setNotification('Ошибка'));
    state = uiReducer(state, setNotification(null));

    expect(state.notification).toBeNull();
  });
});

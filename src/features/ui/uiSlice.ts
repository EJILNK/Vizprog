import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type SaveStatus = 'saved' | 'saving' | 'error';

type UiState = {
  saveStatus: SaveStatus;
  notification: string | null;
};

const initialState: UiState = {
  saveStatus: 'saved',
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSaveStatus(state, action: PayloadAction<SaveStatus>) {
      state.saveStatus = action.payload;
    },

    setNotification(state, action: PayloadAction<string | null>) {
      state.notification = action.payload;
    },
  },
});

export const { setSaveStatus, setNotification } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;

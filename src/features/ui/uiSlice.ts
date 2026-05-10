import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type SaveStatus = 'saved' | 'saving' | 'error';

type UiState = {
  saveStatus: SaveStatus;
  hasUnsavedChanges: boolean;
  notification: string | null;
};

const initialState: UiState = {
  saveStatus: 'saved',
  hasUnsavedChanges: false,
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

    setHasUnsavedChanges(state, action: PayloadAction<boolean>) {
      state.hasUnsavedChanges = action.payload;
    },
  },
});

export const { setSaveStatus, setHasUnsavedChanges, setNotification } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;

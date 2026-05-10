import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from '@features/auth/authSlice';
import { documentsReducer } from '@features/Docs/docsSlice';
import { spreadsheetReducer } from '@features/spreadsheet/spreadsheetSlice';
import { uiReducer } from '@features/ui/uiSlice';

import { spreadsheetAutosave } from './spreadsheetAutosave';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    documents: documentsReducer,
    spreadsheet: spreadsheetReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(spreadsheetAutosave.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

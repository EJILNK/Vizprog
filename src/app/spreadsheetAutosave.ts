import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import type { RootState } from '@app/store';
import { updateDocumentThunk } from '@features/Docs/docsSlice';
import {
  redo,
  setCell,
  setCells,
  setCellFormat,
  setColumnsCount,
  setRowsCount,
  undo,
} from '@features/spreadsheet/spreadsheetSlice';
import { setSaveStatus } from '@features/ui/uiSlice';

export const spreadsheetAutosave = createListenerMiddleware();

spreadsheetAutosave.startListening({
  matcher: isAnyOf(setCell, setCells, setRowsCount, setColumnsCount, setCellFormat, undo, redo),
  effect: async (_action, listenerApi) => {
    listenerApi.cancelActiveListeners();

    listenerApi.dispatch(setSaveStatus('saving'));

    await listenerApi.delay(500);

    const state = listenerApi.getState() as RootState;

    const activeDocumentId = state.documents.activeDocumentId;

    if (!activeDocumentId) {
      return;
    }

    const result = await listenerApi.dispatch(
      updateDocumentThunk({
        documentId: activeDocumentId,
        data: {
          cells: state.spreadsheet.cells,
          rowsCount: state.spreadsheet.rowsCount,
          columnsCount: state.spreadsheet.columnsCount,
        },
      }),
    );

    if (updateDocumentThunk.fulfilled.match(result)) {
      listenerApi.dispatch(setSaveStatus('saved'));
      return;
    }

    listenerApi.dispatch(setSaveStatus('error'));
  },
});

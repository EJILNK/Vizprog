import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { SpreadsheetData } from './types';

type SpreadsheetState = {
  cells: SpreadsheetData;
  rowsCount: number;
  columnsCount: number;
  past: SpreadsheetData[];
  future: SpreadsheetData[];
};

type SetCellPayload = {
  cellId: string;
  value: string;
};

type SetSpreadsheetPayload = {
  cells: SpreadsheetData;
  rowsCount: number;
  columnsCount: number;
};

const initialState: SpreadsheetState = {
  cells: {},
  rowsCount: 100,
  columnsCount: 26,
  past: [],
  future: [],
};

const spreadsheetSlice = createSlice({
  name: 'spreadsheet',
  initialState,
  reducers: {
    setSpreadsheet(state, action: PayloadAction<SetSpreadsheetPayload>) {
      state.cells = action.payload.cells;
      state.rowsCount = action.payload.rowsCount;
      state.columnsCount = action.payload.columnsCount;
      state.past = [];
      state.future = [];
    },

    setCell(state, action: PayloadAction<SetCellPayload>) {
      state.past.push(state.cells);
      state.future = [];

      state.cells = {
        ...state.cells,
        [action.payload.cellId]: {
          raw: action.payload.value,
        },
      };
    },

    setCells(state, action: PayloadAction<SpreadsheetData>) {
      state.past.push(state.cells);
      state.future = [];
      state.cells = action.payload;
    },

    setRowsCount(state, action: PayloadAction<number>) {
      state.rowsCount = action.payload;
    },

    setColumnsCount(state, action: PayloadAction<number>) {
      state.columnsCount = action.payload;
    },

    undo(state) {
      const previousCells = state.past.at(-1);

      if (!previousCells) {
        return;
      }

      state.future.unshift(state.cells);
      state.cells = previousCells;
      state.past = state.past.slice(0, -1);
    },

    redo(state) {
      const nextCells = state.future[0];

      if (!nextCells) {
        return;
      }

      state.past.push(state.cells);
      state.cells = nextCells;
      state.future = state.future.slice(1);
    },
  },
});

export const { setSpreadsheet, setCell, setCells, setRowsCount, setColumnsCount, undo, redo } =
  spreadsheetSlice.actions;

export const spreadsheetReducer = spreadsheetSlice.reducer;

import { describe, expect, it } from 'vitest';

import {
  redo,
  setCell,
  setCells,
  setColumnsCount,
  setRowsCount,
  setSpreadsheet,
  spreadsheetReducer,
  undo,
} from './spreadsheetSlice';

describe('spreadsheetSlice', () => {
  it('sets spreadsheet data', () => {
    const state = spreadsheetReducer(
      undefined,
      setSpreadsheet({
        cells: {
          A1: { raw: '10' },
        },
        rowsCount: 20,
        columnsCount: 10,
      }),
    );

    expect(state.cells.A1?.raw).toBe('10');
    expect(state.rowsCount).toBe(20);
    expect(state.columnsCount).toBe(10);
  });

  it('sets cell value', () => {
    const state = spreadsheetReducer(
      undefined,
      setCell({
        cellId: 'A1',
        value: 'Hello',
      }),
    );

    expect(state.cells.A1?.raw).toBe('Hello');
  });

  it('sets all cells', () => {
    const state = spreadsheetReducer(
      undefined,
      setCells({
        A1: { raw: '1' },
        B1: { raw: '2' },
      }),
    );

    expect(state.cells.A1?.raw).toBe('1');
    expect(state.cells.B1?.raw).toBe('2');
  });

  it('sets rows and columns count', () => {
    let state = spreadsheetReducer(undefined, setRowsCount(50));
    state = spreadsheetReducer(state, setColumnsCount(15));

    expect(state.rowsCount).toBe(50);
    expect(state.columnsCount).toBe(15);
  });

  it('undoes and redoes cell changes', () => {
    let state = spreadsheetReducer(
      undefined,
      setCell({
        cellId: 'A1',
        value: 'First',
      }),
    );

    state = spreadsheetReducer(
      state,
      setCell({
        cellId: 'A1',
        value: 'Second',
      }),
    );

    expect(state.cells.A1?.raw).toBe('Second');

    state = spreadsheetReducer(state, undo());

    expect(state.cells.A1?.raw).toBe('First');

    state = spreadsheetReducer(state, redo());

    expect(state.cells.A1?.raw).toBe('Second');
  });
});

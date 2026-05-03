export type CellId = string;

export type CellData = {
  raw: string;
};

export type SpreadsheetData = Record<CellId, CellData>;

export type ActiveCell = {
  rowIndex: number;
  columnIndex: number;
};

export type SelectedRange = {
  start: ActiveCell;
  end: ActiveCell;
};

export type ContextMenuState = {
  x: number;
  y: number;
  rowIndex: number;
  columnIndex: number;
} | null;

export type ColumnWidths = Record<number, number>;

export type RowHeights = Record<number, number>;

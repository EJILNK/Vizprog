export type CellId = string;

export type CellData = {
  raw: string;
};

export type SpreadsheetData = Record<CellId, CellData>;

export type ActiveCell = {
  rowIndex: number;
  columnIndex: number;
};

export type CellId = string;

export type TextAlign = 'left' | 'center' | 'right';

export type NumberFormat = 'default' | 'percent' | 'currency';

export type CellFormat = {
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  textColor?: string;
  backgroundColor?: string;
  textAlign?: TextAlign;
  numberFormat?: NumberFormat;
};

export type CellData = {
  raw: string;
  format?: CellFormat;
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

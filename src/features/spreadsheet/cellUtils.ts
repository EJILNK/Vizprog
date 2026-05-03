import type { ActiveCell, SelectedRange } from './types';

export const DEFAULT_ROWS_COUNT = 100;
export const DEFAULT_COLUMNS_COUNT = 26;

export function getColumnName(columnIndex: number): string {
  const firstname = Math.trunc(columnIndex / 26);
  if (firstname == 0) return String.fromCharCode(65 + (columnIndex % 26));
  return String.fromCharCode(64 + firstname) + String.fromCharCode(65 + (columnIndex % 26));
}

export function getCellId(rowIndex: number, columnIndex: number): string {
  const columnName = getColumnName(columnIndex);
  const rowName = rowIndex + 1;

  return `${columnName}${rowName}`;
}

export function getColumnIndex(columnName: string): number {
  return columnName.toUpperCase().charCodeAt(0) - 65;
}

export function getCellPosition(CellId: string): { rowIndex: number; columnIndex: number } | null {
  const match = CellId.match(/^([A-Z])(\d+)$/i);

  if (!match) {
    return null;
  }

  const columnIndex = getColumnIndex(match[1]);
  const rowIndex = Number(match[2]) - 1;

  return { rowIndex, columnIndex };
}

export function isCellInRange(position: ActiveCell, range: SelectedRange | null): boolean {
  if (!range) {
    return false;
  }

  const minRow = Math.min(range.start.rowIndex, range.end.rowIndex);
  const maxRow = Math.max(range.start.rowIndex, range.end.rowIndex);
  const minColumn = Math.min(range.start.columnIndex, range.end.columnIndex);
  const maxColumn = Math.max(range.start.columnIndex, range.end.columnIndex);

  return (
    position.rowIndex >= minRow &&
    position.rowIndex <= maxRow &&
    position.columnIndex >= minColumn &&
    position.columnIndex <= maxColumn
  );
}

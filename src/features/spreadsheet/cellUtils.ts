export const DEFAULT_ROWS_COUNT = 100;
export const DEFAULT_COLUMNS_COUNT = 26;

export function getColumnName(columnIndex: number): string {
  return String.fromCharCode(65 + columnIndex);
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

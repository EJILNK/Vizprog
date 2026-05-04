import { getCellId } from '@features/spreadsheet/cellUtils';
import { getCellDisplayValue } from '@features/spreadsheet/formuls';
import type { SpreadsheetData } from '@features/spreadsheet/types';

export function createCsvFromCells(
  cells: SpreadsheetData,
  rowsCount: number,
  columnsCount: number,
): string {
  const rows: string[] = [];

  for (let rowIndex = 0; rowIndex < rowsCount; rowIndex += 1) {
    const rowValues: string[] = [];

    for (let columnIndex = 0; columnIndex < columnsCount; columnIndex += 1) {
      const cellId = getCellId(rowIndex, columnIndex);
      const rawValue = cells[cellId]?.raw ?? '';
      const displayValue = getCellDisplayValue(cells, rawValue);

      rowValues.push(`"${displayValue.replaceAll('"', '""')}"`);
    }

    rows.push(rowValues.join(','));
  }

  return rows.join('\n');
}

export function parseCsvToCells(csvText: string): {
  cells: SpreadsheetData;
  rowsCount: number;
  columnsCount: number;
} {
  const rows = csvText
    .trim()
    .split(/\r?\n/)
    .map((row) =>
      row.split(',').map((cell) => cell.trim().replace(/^"|"$/g, '').replaceAll('""', '"')),
    );

  const cells: SpreadsheetData = {};

  rows.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      if (value === '') {
        return;
      }

      const cellId = getCellId(rowIndex, columnIndex);

      cells[cellId] = {
        raw: value,
      };
    });
  });

  return {
    cells,
    rowsCount: Math.max(rows.length, 1),
    columnsCount: Math.max(rows[0]?.length ?? 1, 1),
  };
}

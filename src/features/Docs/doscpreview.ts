import { getCellDisplayValue } from '@features/spreadsheet/formuls';
import { getCellId } from '@features/spreadsheet/cellUtils';
import type { SpreadsheetDocument } from './doctypes';

export function getDocumentPreview(document: SpreadsheetDocument): string[][] {
  const previewRows: string[][] = [];

  const rowsCount = Math.min(3, document.rowsCount);
  const columnsCount = Math.min(3, document.columnsCount);

  for (let rowIndex = 0; rowIndex < rowsCount; rowIndex += 1) {
    const rowValues: string[] = [];

    for (let columnIndex = 0; columnIndex < columnsCount; columnIndex += 1) {
      const cellId = getCellId(rowIndex, columnIndex);
      const rawValue = document.cells[cellId]?.raw ?? '';
      const displayValue = getCellDisplayValue(document.cells, rawValue);

      rowValues.push(displayValue);
    }

    previewRows.push(rowValues);
  }

  return previewRows;
}

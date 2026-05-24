import type { SpreadsheetData } from './types';
import { getCellId, getCellPosition } from './cellUtils';
import type { NumberFormat } from './types';

function getNumberFromCell(cells: SpreadsheetData, CellId: string): number {
  const cell = cells[CellId];

  if (!cell) {
    return 0;
  }

  const value = Number(cell.raw);

  if (Number.isNaN(value)) {
    return 0;
  }

  return value;
}

function getValuesFromRange(cells: SpreadsheetData, range: string): number[] {
  const [startCellId, endCellID] = range.split(':');

  const startPosition = getCellPosition(startCellId);
  const endPosition = getCellPosition(endCellID);

  if (!startPosition || !endPosition) {
    return [];
  }

  const values: number[] = [];

  for (let row = startPosition.rowIndex; row <= endPosition.rowIndex; row += 1) {
    for (let column = startPosition.columnIndex; column <= endPosition.columnIndex; column += 1) {
      const CellId = getCellId(row, column);
      values.push(getNumberFromCell(cells, CellId));
    }
  }

  return values;
}

function calculateSum(cells: SpreadsheetData, range: string): string {
  const values = getValuesFromRange(cells, range);
  const result = values.reduce((sum, value) => sum + value, 0);

  return String(result);
}

function calculateAVG(cells: SpreadsheetData, range: string): string {
  const values = getValuesFromRange(cells, range);

  if (values.length == 0) {
    return '0';
  }

  const sum = values.reduce((sum, value) => sum + value, 0);

  return String(sum / values.length);
}

function calculateExpression(cells: SpreadsheetData, expression: string): string {
  const preparedExpression = expression.replace(/[A-Z]\d+/gi, (cellId) => {
    return String(getNumberFromCell(cells, cellId));
  });

  if (!/^[\d+\-*/().\s]+$/.test(preparedExpression)) {
    return 'Ошибочка вышла';
  }

  try {
    const result = Function(`"use strict"; return (${preparedExpression})`)();

    if (typeof result !== 'number' || Number.isNaN(result)) {
      return 'Ошибка';
    }

    return String(result);
  } catch {
    return 'Ошибка';
  }
}

export function getCellDisplayValue(cells: SpreadsheetData, rawValue: string): string {
  if (!rawValue.startsWith('=')) {
    return rawValue;
  }

  const formula = rawValue.slice(1).trim();

  const sumMatch = formula.match(/^SUM\(([A-Z]\d+:[A-Z]\d+)\)$/i);

  if (sumMatch) {
    return calculateSum(cells, sumMatch[1]);
  }

  const avgMatch = formula.match(/^AVG\(([A-Z]\d+:[A-Z]\d+)\)$/i);

  if (avgMatch) {
    return calculateAVG(cells, avgMatch[1]);
  }

  return calculateExpression(cells, formula);
}

export function formatCellDisplayValue(value: string, numberFormat?: NumberFormat): string {
  if (!numberFormat || numberFormat === 'default') {
    return value;
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return value;
  }

  if (numberFormat === 'percent') {
    return `${numberValue}%`;
  }

  if (numberFormat === 'currency') {
    return `${numberValue} ₽`;
  }

  return value;
}

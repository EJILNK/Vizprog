import type { SpreadsheetData } from '@features/spreadsheet/types';

export type SpreadsheetDocument = {
  id: string;
  title: string;
  rowsCount: number;
  columnsCount: number;
  cells: SpreadsheetData;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
};

export type CreateDocumentData = {
  title: string;
  rowsCount: number;
  columnsCount: number;
};
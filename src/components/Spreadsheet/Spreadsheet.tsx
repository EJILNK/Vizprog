import React, { useMemo, useState } from 'react';

import {
  DEFAULT_COLUMNS_COUNT,
  DEFAULT_ROWS_COUNT,
  getCellId,
  getColumnName,
} from '@features/spreadsheet/cellUtils';
import { getCellDisplayValue } from '@features/spreadsheet/formuls';
import type { ActiveCell, SpreadsheetData } from '@features/spreadsheet/types';

import { Cell } from './Cell';
import { FormulBar } from './FormulBar';

import './Spreadsheet.css';

export function Spreadsheet() {
  const [cells, setCells] = useState<SpreadsheetData>({});
  const [activeCell, setActiveCell] = useState<ActiveCell>({
    rowIndex: 0,
    columnIndex: 0,
  });
  const [editingCellId, setEditingCellId] = useState<string | null>(null);

  const columns = useMemo(() => {
    return Array.from({ length: DEFAULT_COLUMNS_COUNT }, (_, index) => index);
  }, []);

  const rows = useMemo(() => {
    return Array.from({ length: DEFAULT_ROWS_COUNT }, (_, index) => index);
  }, []);

  const activeCellId = getCellId(activeCell.rowIndex, activeCell.columnIndex);
  const activeRawValue = cells[activeCellId]?.raw ?? '';

  function updateCell(cellId: string, value: string): void {
    setCells((currentCells) => ({
      ...currentCells,
      [cellId]: {
        raw: value,
      },
    }));
  }

  function handleFormulBarChange(value: string): void {
    updateCell(activeCellId, value);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Enter') {
      setEditingCellId(activeCellId);
    }
  }

  return (
    <div className="spreadsheet" tabIndex={0} onKeyDown={handleKeyDown}>
      <FormulBar
        activeCellId={activeCellId}
        value={activeRawValue}
        onChange={handleFormulBarChange}
      />

      <div className="spreadsheet_table_wrapper">
        <table className="spreadsheet_table">
          <thead>
            <tr>
              <th className="spreadsheet_corner" />

              {columns.map((columnIndex) => (
                <th key={columnIndex} className="spreadsheet_column_header">
                  {getColumnName(columnIndex)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((rowIndex) => (
              <tr key={rowIndex}>
                <th className="spreadsheet_row_header">{rowIndex + 1}</th>

                {columns.map((columnIndex) => {
                  const cellId = getCellId(rowIndex, columnIndex);
                  const rawValue = cells[cellId]?.raw ?? '';
                  const displayValue = getCellDisplayValue(cells, rawValue);
                  const isActive =
                    activeCell.rowIndex === rowIndex && activeCell.columnIndex === columnIndex;

                  return (
                    <Cell
                      key={cellId}
                      value={displayValue}
                      rawValue={rawValue}
                      isActive={isActive}
                      isEditing={editingCellId === cellId}
                      onSelect={() => {
                        setActiveCell({
                          rowIndex,
                          columnIndex,
                        });
                      }}
                      onStartEdit={() => setEditingCellId(cellId)}
                      onStopEdit={() => setEditingCellId(null)}
                      onChange={(value) => updateCell(cellId, value)}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

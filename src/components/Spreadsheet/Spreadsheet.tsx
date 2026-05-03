import React, { useMemo, useState } from 'react';

import {
  DEFAULT_COLUMNS_COUNT,
  DEFAULT_ROWS_COUNT,
  getCellId,
  getColumnName,
  isCellInRange,
} from '@features/spreadsheet/cellUtils';
import { getCellDisplayValue } from '@features/spreadsheet/formuls';
import type {
  ActiveCell,
  SpreadsheetData,
  SelectedRange,
  ContextMenuState,
} from '@features/spreadsheet/types';

import { Cell } from './Cell';
import { FormulBar } from './FormulBar';
import { SpreadsheetContextMenu } from './SpreadsheetContextMenu';

import './Spreadsheet.css';

export function Spreadsheet() {
  const [cells, setCells] = useState<SpreadsheetData>({});
  const [rowsCount, setRowsCount] = useState(DEFAULT_ROWS_COUNT);
  const [columnsCount, setColumnsCount] = useState(DEFAULT_COLUMNS_COUNT);
  const [activeCell, setActiveCell] = useState<ActiveCell>({
    rowIndex: 0,
    columnIndex: 0,
  });
  const [selectedRange, setSelectedRange] = useState<SelectedRange | null>(null);
  const [editingCellId, setEditingCellId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

  const columns = useMemo(() => {
    return Array.from({ length: columnsCount }, (_, index) => index);
  }, [columnsCount]);

  const rows = useMemo(() => {
    return Array.from({ length: rowsCount }, (_, index) => index);
  }, [rowsCount]);

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

  function handleSelectCell(
    event: React.MouseEvent<HTMLTableCellElement>,
    position: ActiveCell,
  ): void {
    setContextMenu(null);
    if (event.shiftKey) {
      setSelectedRange({
        start: activeCell,
        end: position,
      });

      return;
    }

    setSelectedRange(null);
    setActiveCell(position);
  }

  function handleContextMenu(
    event: React.MouseEvent<HTMLTableCellElement>,
    position: ActiveCell,
  ): void {
    event.preventDefault();

    setActiveCell(position);
    setSelectedRange(null);

    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      rowIndex: position.rowIndex,
      columnIndex: position.columnIndex,
    });
  }

  function handleFormulBarChange(value: string): void {
    updateCell(activeCellId, value);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Enter') {
      setEditingCellId(activeCellId);
    }

    if (event.key === 'Escape') {
      setContextMenu(null);
      setSelectedRange(null);
      setEditingCellId(null);
    }
  }

  function addRow(rowIndex: number): void {
    const newCells: SpreadsheetData = {};

    Object.entries(cells).forEach(([cellId, cell]) => {
      const match = cellId.match(/^([A-Z])(\d+)$/);

      if (!match) {
        return;
      }

      const columnName = match[1];
      const currentRowIndex = Number(match[2]) - 1;

      if (currentRowIndex <= rowIndex) {
        newCells[cellId] = cell;
        return;
      }

      const newCellId = `${columnName}${currentRowIndex + 2}`;
      newCells[newCellId] = cell;
    });

    setCells(newCells);
    setRowsCount((currentRowsCount) => currentRowsCount + 1);
    setSelectedRange(null);
  }

  function deleteRow(rowIndex: number): void {
    if (rowsCount <= 1) {
      return;
    }

    const newCells: SpreadsheetData = {};

    Object.entries(cells).forEach(([cellId, cell]) => {
      const match = cellId.match(/^([A-Z])(\d+)$/);

      if (!match) {
        return;
      }

      const columnName = match[1];
      const currentRowIndex = Number(match[2]) - 1;

      if (currentRowIndex < rowIndex) {
        newCells[cellId] = cell;
        return;
      }

      if (currentRowIndex > rowIndex) {
        const newCellId = `${columnName}${currentRowIndex}`;
        newCells[newCellId] = cell;
      }
    });

    setCells(newCells);
    setRowsCount((currentRowsCount) => currentRowsCount - 1);
    setSelectedRange(null);

    setActiveCell((currentActiveCell) => ({
      rowIndex: Math.min(currentActiveCell.rowIndex, rowsCount - 2),
      columnIndex: currentActiveCell.columnIndex,
    }));
  }

  function addColumn(columnIndex: number): void {
    const newCells: SpreadsheetData = {};

    Object.entries(cells).forEach(([cellId, cell]) => {
      const match = cellId.match(/^([A-Z])(\d+)$/);

      if (!match) {
        return;
      }

      const currentColumnIndex = match[1].charCodeAt(0) - 65;
      const rowNumber = match[2];

      if (currentColumnIndex <= columnIndex) {
        newCells[cellId] = cell;
        return;
      }

      const newColumnName = getColumnName(currentColumnIndex + 1);
      const newCellId = `${newColumnName}${rowNumber}`;
      newCells[newCellId] = cell;
    });

    setCells(newCells);
    setColumnsCount((currentColumnsCount) => currentColumnsCount + 1);
    setSelectedRange(null);
  }

  function deleteColumn(columnIndex: number): void {
    if (columnsCount <= 1) {
      return;
    }

    const newCells: SpreadsheetData = {};

    Object.entries(cells).forEach(([cellId, cell]) => {
      const match = cellId.match(/^([A-Z])(\d+)$/);

      if (!match) {
        return;
      }

      const currentColumnIndex = match[1].charCodeAt(0) - 65;
      const rowNumber = match[2];

      if (currentColumnIndex < columnIndex) {
        newCells[cellId] = cell;
        return;
      }

      if (currentColumnIndex > columnIndex) {
        const newColumnName = getColumnName(currentColumnIndex - 1);
        const newCellId = `${newColumnName}${rowNumber}`;
        newCells[newCellId] = cell;
      }
    });

    setCells(newCells);
    setColumnsCount((currentColumnsCount) => currentColumnsCount - 1);
    setSelectedRange(null);

    setActiveCell((currentActiveCell) => ({
      rowIndex: currentActiveCell.rowIndex,
      columnIndex: Math.min(currentActiveCell.columnIndex, columnsCount - 2),
    }));
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
                  const position = {
                    rowIndex,
                    columnIndex,
                  };
                  const isSelected = isCellInRange(position, selectedRange);

                  return (
                    <Cell
                      key={cellId}
                      value={displayValue}
                      rawValue={rawValue}
                      isActive={isActive}
                      isSelected={isSelected}
                      isEditing={editingCellId === cellId}
                      onSelect={(event) => handleSelectCell(event, position)}
                      onStartEdit={() => setEditingCellId(cellId)}
                      onStopEdit={() => setEditingCellId(null)}
                      onChange={(value) => updateCell(cellId, value)}
                      onContexMenu={(event) => handleContextMenu(event, position)}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SpreadsheetContextMenu
        menu={contextMenu}
        onAddRow={addRow}
        onDeleteRow={deleteRow}
        onAddColumn={addColumn}
        onDeleteColumn={deleteColumn}
        onClose={() => setContextMenu(null)}
      />
    </div>
  );
}

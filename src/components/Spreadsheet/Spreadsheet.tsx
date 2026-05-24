import React, { useMemo, useState, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@app/hooks';

import { setSaveStatus, setHasUnsavedChanges } from '@features/ui/uiSlice';

import {
  redo,
  setCell,
  setCells,
  setCellFormat,
  setColumnsCount,
  setRowsCount,
  setSpreadsheet,
  undo,
} from '@features/spreadsheet/spreadsheetSlice';

import { getCellId, getColumnName, isCellInRange } from '@features/spreadsheet/cellUtils';
import { getCellDisplayValue, formatCellDisplayValue } from '@features/spreadsheet/formuls';
import type {
  ActiveCell,
  SpreadsheetData,
  SelectedRange,
  CellFormat,
  NumberFormat,
  ContextMenuState,
  ColumnWidths,
  RowHeights,
} from '@features/spreadsheet/types';

import { updateDocumentThunk } from '@features/Docs/docsSlice';
import type { SpreadsheetDocument } from '@features/Docs/doctypes';

import { Cell } from './Cell';
import { FormulBar } from './FormulBar';
import { SpreadsheetContextMenu } from './SpreadsheetContextMenu';

import { downloadFile } from '@utils/download';
import { createCsvFromCells, parseCsvToCells } from '@utils/csvparse';

import { FormatBar } from './FormatBar';

import './Spreadsheet.css';

const DEFAULT_COLUMN_WIDTH = 120;
const MIN_COLUMN_WIDTH = 30;

const DEFAULT_ROW_HEIGHT = 24;
const MIN_ROW_HEIGHT = 20;

type SpreadsheetProps = {
  document: SpreadsheetDocument;
  onDocumentChange: (document: SpreadsheetDocument) => void;
};

export function Spreadsheet({ document, onDocumentChange }: SpreadsheetProps) {
  const dispatch = useAppDispatch();

  const cells = useAppSelector((state) => state.spreadsheet.cells);
  const rowsCount = useAppSelector((state) => state.spreadsheet.rowsCount);
  const columnsCount = useAppSelector((state) => state.spreadsheet.columnsCount);
  const [columnWidths, setColumnWidths] = useState<ColumnWidths>({});
  const [rowHeights, setRowHeights] = useState<RowHeights>({});
  const [activeCell, setActiveCell] = useState<ActiveCell>({
    rowIndex: 0,
    columnIndex: 0,
  });
  const [selectedRange, setSelectedRange] = useState<SelectedRange | null>(null);
  const [editingCellId, setEditingCellId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);
  const [clipboardValue, setClipboardValue] = useState<string | null>(null);

  const saveStatus = useAppSelector((state) => state.ui.saveStatus);
  const hasUnsavedChanges = useAppSelector((state) => state.ui.hasUnsavedChanges);

  const columns = useMemo(() => {
    return Array.from({ length: columnsCount }, (_, index) => index);
  }, [columnsCount]);

  const rows = useMemo(() => {
    return Array.from({ length: rowsCount }, (_, index) => index);
  }, [rowsCount]);

  const activeCellId = getCellId(activeCell.rowIndex, activeCell.columnIndex);
  const activeRawValue = cells[activeCellId]?.raw ?? '';
  const activeCellFormat = cells[activeCellId]?.format;

  useEffect(() => {
    dispatch(
      setSpreadsheet({
        cells: document.cells,
        rowsCount: document.rowsCount,
        columnsCount: document.columnsCount,
      }),
    );
  }, [dispatch, document.id]);

  function updateCell(cellId: string, value: string): void {
    dispatch(setHasUnsavedChanges(true));

    dispatch(
      setCell({
        cellId,
        value,
      }),
    );
  }

  function clearActiveCell(): void {
    dispatch(setHasUnsavedChanges(true));

    dispatch(
      setCell({
        cellId: activeCellId,
        value: '',
      }),
    );
  }

  function copyActiveCell(): void {
    setClipboardValue(activeRawValue);
  }

  function cutActiveCell(): void {
    setClipboardValue(activeRawValue);
    clearActiveCell();
  }

  function pasteToActiveCell(): void {
    if (clipboardValue === null) {
      return;
    }

    updateCell(activeCellId, clipboardValue);
  }

  function moveActiveCell(rowDelta: number, columnDelta: number): void {
    setActiveCell((currentActiveCell) => ({
      rowIndex: Math.min(Math.max(currentActiveCell.rowIndex + rowDelta, 0), rowsCount - 1),
      columnIndex: Math.min(
        Math.max(currentActiveCell.columnIndex + columnDelta, 0),
        columnsCount - 1,
      ),
    }));

    setSelectedRange(null);
  }

  function moveActiveCellRight(): void {
    moveActiveCell(0, 1);
  }

  function selectAllCells(): void {
    setSelectedRange({
      start: {
        rowIndex: 0,
        columnIndex: 0,
      },
      end: {
        rowIndex: rowsCount - 1,
        columnIndex: columnsCount - 1,
      },
    });
  }
  function focusSpreadsheet(): void {
    window.requestAnimationFrame(() => {
      const spreadsheetElement = window.document.querySelector<HTMLElement>('.spreadsheet');
      spreadsheetElement?.focus();
    });
  }

  function updateActiveCellFormat(format: CellFormat): void {
    dispatch(setHasUnsavedChanges(true));

    dispatch(
      setCellFormat({
        cellId: activeCellId,
        format,
      }),
    );
  }

  function toggleBold(): void {
    updateActiveCellFormat({
      isBold: !activeCellFormat?.isBold,
    });
  }

  function toggleItalic(): void {
    updateActiveCellFormat({
      isItalic: !activeCellFormat?.isItalic,
    });
  }

  function toggleUnderline(): void {
    updateActiveCellFormat({
      isUnderline: !activeCellFormat?.isUnderline,
    });
  }

  function changeTextColor(color: string): void {
    updateActiveCellFormat({
      textColor: color,
    });
  }

  function changeBackgroundColor(color: string): void {
    updateActiveCellFormat({
      backgroundColor: color,
    });
  }

  function changeTextAlign(align: 'left' | 'center' | 'right'): void {
    updateActiveCellFormat({
      textAlign: align,
    });
  }

  function changeNumberFormat(format: NumberFormat): void {
    updateActiveCellFormat({
      numberFormat: format,
    });
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
    if (editingCellId) {
      return;
    }

    if (event.key === 'Enter') {
      setEditingCellId(activeCellId);
    }

    if (event.key === 'Escape') {
      setContextMenu(null);
      setSelectedRange(null);
      setEditingCellId(null);
    }

    if (event.ctrlKey && event.key.toLowerCase() === 's') {
      event.preventDefault();
      saveDocument();
      return;
    }
    if (event.ctrlKey && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      dispatch(undo());
      dispatch(setHasUnsavedChanges(true));
      return;
    }

    if (
      event.ctrlKey &&
      (event.key.toLowerCase() === 'y' || (event.shiftKey && event.key.toLowerCase() === 'z'))
    ) {
      event.preventDefault();
      dispatch(redo());
      dispatch(setHasUnsavedChanges(true));
      return;
    }
    if (event.ctrlKey && event.key.toLowerCase() === 'b') {
      event.preventDefault();
      toggleBold();
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'i') {
      event.preventDefault();
      toggleItalic();
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'u') {
      event.preventDefault();
      toggleUnderline();
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'c') {
      event.preventDefault();
      copyActiveCell();
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'x') {
      event.preventDefault();
      cutActiveCell();
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === 'v') {
      event.preventDefault();
      pasteToActiveCell();
      return;
    }
    if (event.ctrlKey && event.key.toLowerCase() === 'a') {
      event.preventDefault();
      selectAllCells();
      return;
    }
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      clearActiveCell();
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      moveActiveCellRight();
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveActiveCell(-1, 0);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveActiveCell(1, 0);
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveActiveCell(0, -1);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveActiveCell(0, 1);
      return;
    }
  }

  function handleColumnResizeStart(
    event: React.MouseEvent<HTMLDivElement>,
    columnIndex: number,
  ): void {
    event.preventDefault();
    event.stopPropagation();

    const startX = event.clientX;
    const startWidth = columnWidths[columnIndex] ?? DEFAULT_COLUMN_WIDTH;

    function handleMouseMove(mouseMoveEvent: MouseEvent): void {
      const deltaX = mouseMoveEvent.clientX - startX;
      const newWidth = Math.max(MIN_COLUMN_WIDTH, startWidth + deltaX);

      setColumnWidths((currentColumnWidths) => ({
        ...currentColumnWidths,
        [columnIndex]: newWidth,
      }));
    }

    function handleMouseUp(): void {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }

  function handleRowResizeStart(event: React.MouseEvent<HTMLDivElement>, rowIndex: number): void {
    event.preventDefault();
    event.stopPropagation();

    const startY = event.clientY;
    const startHeight = rowHeights[rowIndex] ?? DEFAULT_ROW_HEIGHT;

    function handleMouseMove(mouseMoveEvent: MouseEvent): void {
      const deltaY = mouseMoveEvent.clientY - startY;
      const newHeight = Math.max(MIN_ROW_HEIGHT, startHeight + deltaY);

      setRowHeights((currentRowHeights) => ({
        ...currentRowHeights,
        [rowIndex]: newHeight,
      }));
    }

    function handleMouseUp(): void {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }

  function addRow(rowIndex: number): void {
    dispatch(setHasUnsavedChanges(true));
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

    dispatch(setCells(newCells));
    dispatch(setRowsCount(rowsCount + 1));
    setSelectedRange(null);
  }

  function deleteRow(rowIndex: number): void {
    if (rowsCount <= 1) {
      return;
    }

    dispatch(setHasUnsavedChanges(true));
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

    dispatch(setCells(newCells));
    dispatch(setRowsCount(rowsCount - 1));
    setSelectedRange(null);

    setActiveCell((currentActiveCell) => ({
      rowIndex: Math.min(currentActiveCell.rowIndex, rowsCount - 2),
      columnIndex: currentActiveCell.columnIndex,
    }));
  }

  function addColumn(columnIndex: number): void {
    dispatch(setHasUnsavedChanges(true));
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

    dispatch(setCells(newCells));
    dispatch(setColumnsCount(columnsCount + 1));
    setSelectedRange(null);
  }

  function deleteColumn(columnIndex: number): void {
    if (columnsCount <= 1) {
      return;
    }

    dispatch(setHasUnsavedChanges(true));
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

    dispatch(setCells(newCells));
    dispatch(setColumnsCount(columnsCount - 1));
    setSelectedRange(null);

    setActiveCell((currentActiveCell) => ({
      rowIndex: currentActiveCell.rowIndex,
      columnIndex: Math.min(currentActiveCell.columnIndex, columnsCount - 2),
    }));
  }

  function saveDocument(): void {
    dispatch(setSaveStatus('saving'));

    void dispatch(
      updateDocumentThunk({
        documentId: document.id,
        data: {
          cells,
          rowsCount,
          columnsCount,
        },
      }),
    )
      .unwrap()
      .then((updatedDocument) => {
        dispatch(setSaveStatus('saved'));
        dispatch(setHasUnsavedChanges(false));
        onDocumentChange(updatedDocument);
      })
      .catch(() => {
        dispatch(setSaveStatus('error'));
      });
  }

  function exportJson(): void {
    const documentForExport = {
      ...document,
      cells,
      rowsCount,
      columnsCount,
      updatedAt: new Date().toISOString(),
    };

    downloadFile(
      `${document.title}.json`,
      JSON.stringify(documentForExport, null, 2),
      'application/json',
    );
  }

  function exportCsv(): void {
    const csv = createCsvFromCells(cells, rowsCount, columnsCount);

    downloadFile(`${document.title}.csv`, csv, 'text/csv;charset=utf-8');
  }

  function importCsv(file: File): void {
    const reader = new FileReader();

    reader.onload = () => {
      const text = String(reader.result);
      const importedTable = parseCsvToCells(text);

      dispatch(setCells(importedTable.cells));
      dispatch(setRowsCount(importedTable.rowsCount));
      dispatch(setColumnsCount(importedTable.columnsCount));
      dispatch(setHasUnsavedChanges(true));
    };

    reader.readAsText(file);
  }

  function handleImportCsv(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    importCsv(file);
    event.target.value = '';
  }

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent): void {
      if (!hasUnsavedChanges) {
        return;
      }

      event.preventDefault();
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (saveStatus === 'saved') {
      dispatch(setHasUnsavedChanges(false));
    }
  }, [saveStatus]);

  return (
    <div className="spreadsheet" tabIndex={0} onKeyDown={handleKeyDown}>
      <div className="spreadsheet_save_status">
        {saveStatus === 'saved' && 'Сохранено'}
        {saveStatus === 'saving' && 'Сохранение...'}
        {saveStatus === 'error' && 'Ошибка сохранения'}
      </div>

      <div className="spreadsheet_export_panel">
        <button type="button" onClick={exportJson}>
          Экспорт JSON
        </button>

        <button type="button" onClick={exportCsv}>
          Экспорт CSV
        </button>

        <label className="spreadsheet_import_button">
          Импорт CSV
          <input type="file" accept=".csv,text/csv" onChange={handleImportCsv} />
        </label>
      </div>

      <FormatBar
        activeFormat={activeCellFormat}
        onToggleBold={toggleBold}
        onToggleItalic={toggleItalic}
        onToggleUnderline={toggleUnderline}
        onTextColorChange={changeTextColor}
        onBackgroundColorChange={changeBackgroundColor}
        onTextAlignChange={changeTextAlign}
        onNumberFormatChange={changeNumberFormat}
      />

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

              {columns.map((columnIndex) => {
                const columnWidth = columnWidths[columnIndex] ?? DEFAULT_COLUMN_WIDTH;

                return (
                  <th
                    key={columnIndex}
                    className="spreadsheet_column_header"
                    style={{
                      width: columnWidth,
                      minWidth: columnWidth,
                    }}
                  >
                    {getColumnName(columnIndex)}

                    <div
                      className="spreadsheet_column_resizer"
                      onMouseDown={(event) => handleColumnResizeStart(event, columnIndex)}
                    />
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {rows.map((rowIndex) => (
              <tr key={rowIndex}>
                <th
                  className="spreadsheet_row_header"
                  style={{
                    height: rowHeights[rowIndex] ?? DEFAULT_ROW_HEIGHT,
                  }}
                >
                  {rowIndex + 1}

                  <div
                    className="spreadsheet_row_resizer"
                    onMouseDown={(event) => handleRowResizeStart(event, rowIndex)}
                  />
                </th>
                {columns.map((columnIndex) => {
                  const cellId = getCellId(rowIndex, columnIndex);
                  const rawValue = cells[cellId]?.raw ?? '';
                  const calculatedValue = getCellDisplayValue(cells, rawValue);
                  const cellFormat = cells[cellId]?.format;
                  const displayValue = formatCellDisplayValue(
                    calculatedValue,
                    cellFormat?.numberFormat,
                  );
                  const columnWidth = columnWidths[columnIndex] ?? DEFAULT_COLUMN_WIDTH;
                  const rowHeight = rowHeights[rowIndex] ?? DEFAULT_ROW_HEIGHT;
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
                      format={cellFormat}
                      width={columnWidth}
                      height={rowHeight}
                      isActive={isActive}
                      isSelected={isSelected}
                      isEditing={editingCellId === cellId}
                      onSelect={(event) => handleSelectCell(event, position)}
                      onStartEdit={() => setEditingCellId(cellId)}
                      onStopEdit={() => {
                        setEditingCellId(null);
                        focusSpreadsheet();
                      }}
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

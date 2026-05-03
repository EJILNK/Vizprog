import type { ContextMenuState } from '@features/spreadsheet/types';

type SpreadsheetContextMenuProps = {
  menu: ContextMenuState;
  onAddRow: (rowIndex: number) => void;
  onDeleteRow: (rowIndex: number) => void;
  onAddColumn: (columnIndex: number) => void;
  onDeleteColumn: (columnIndex: number) => void;
  onClose: () => void;
};

export function SpreadsheetContextMenu({
  menu,
  onAddRow,
  onDeleteRow,
  onAddColumn,
  onDeleteColumn,
  onClose,
}: SpreadsheetContextMenuProps) {
  if (!menu) {
    return null;
  }

  function handleAddRow(): void {
    if (!menu) {
      return;
    }

    onAddRow(menu.rowIndex);
    onClose();
  }

  function handleDeleteRow(): void {
    if (!menu) {
      return;
    }

    onDeleteRow(menu.rowIndex);
    onClose();
  }

  function handleAddColumn(): void {
    if (!menu) {
      return;
    }

    onAddColumn(menu.columnIndex);
    onClose();
  }

  function handleDeleteColumn(): void {
    if (!menu) {
      return;
    }

    onDeleteColumn(menu.columnIndex);
    onClose();
  }

  return (
    <div
      className="context_menu"
      style={{
        left: menu.x,
        top: menu.y,
      }}
    >
      <button type="button" onClick={handleAddRow}>
        Добавить строку ниже
      </button>

      <button type="button" onClick={handleDeleteRow}>
        Удалить строку
      </button>

      <button type="button" onClick={handleAddColumn}>
        Добавить столбец справа
      </button>

      <button type="button" onClick={handleDeleteColumn}>
        Удалить столбец
      </button>
    </div>
  );
}

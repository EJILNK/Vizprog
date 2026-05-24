import React, { memo, useEffect, useState } from 'react';

import type { CellFormat } from '@features/spreadsheet/types';

type CellProps = {
  value: string;
  rawValue: string;
  width: number;
  height: number;
  isActive: boolean;
  isEditing: boolean;
  isSelected: boolean;
  format?: CellFormat;
  onSelect: (event: React.MouseEvent<HTMLTableCellElement>) => void;
  onStartEdit: () => void;
  onStopEdit: () => void;
  onChange: (value: string) => void;
  onContexMenu: (event: React.MouseEvent<HTMLTableCellElement>) => void;
};

export const Cell = memo(function Cell({
  value,
  rawValue,
  width,
  height,
  isActive,
  isEditing,
  isSelected,
  format,
  onSelect,
  onStartEdit,
  onStopEdit,
  onChange,
  onContexMenu,
}: CellProps) {
  const [localValue, setLocalValue] = useState(rawValue);

  useEffect(() => {
    setLocalValue(rawValue);
  }, [rawValue]);

  function handleSave(): void {
    onChange(localValue);
    onStopEdit();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
      handleSave();
    }

    if (event.key === 'Escape') {
      setLocalValue(rawValue);
      onStopEdit();
    }
  }

  const cellStyle = {
    width,
    minWidth: width,
    height,
    fontWeight: format?.isBold ? '700' : '400',
    fontStyle: format?.isItalic ? 'italic' : 'normal',
    textDecoration: format?.isUnderline ? 'underline' : 'none',
    color: format?.textColor,
    backgroundColor: format?.backgroundColor,
    textAlign: format?.textAlign,
  };

  if (isEditing) {
    return (
      <td className="cell cell_active" style={cellStyle}>
        <input
          className="cell_input"
          value={localValue}
          autoFocus
          onChange={(event) => setLocalValue(event.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
        />
      </td>
    );
  }

  const className = ['cell'];

  if (isSelected) {
    className.push('cell_selected');
  }

  if (isActive) {
    className.push('cell_active');
  }

  return (
    <td
      className={className.join(' ')}
      style={cellStyle}
      onClick={onSelect}
      onDoubleClick={onStartEdit}
      onContextMenu={onContexMenu}
    >
      {value}
    </td>
  );
});

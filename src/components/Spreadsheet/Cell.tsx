import React, { memo, useEffect, useState } from 'react';

type CellProps = {
  value: string;
  rawValue: string;
  isActive: boolean;
  isEditing: boolean;
  isSelected: boolean;
  onSelect: (event: React.MouseEvent<HTMLTableCellElement>) => void;
  onStartEdit: () => void;
  onStopEdit: () => void;
  onChange: (value: string) => void;
  onContexMenu: (event: React.MouseEvent<HTMLTableCellElement>) => void;
};

export const Cell = memo(function Cell({
  value,
  rawValue,
  isActive,
  isEditing,
  isSelected,
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

  if (isEditing) {
    return (
      <td className="cell cell_active">
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
      onClick={onSelect}
      onDoubleClick={onStartEdit}
      onContextMenu={onContexMenu}
    >
      {value}
    </td>
  );
});

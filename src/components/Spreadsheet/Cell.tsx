import { memo, useEffect, useState } from 'react';

type CellProps = {
  value: string;
  rawValue: string;
  isActive: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onStartEdit: () => void;
  onStopEdit: () => void;
  onChange: (value: string) => void;
};

export const Cell = memo(function Cell({
  value,
  rawValue,
  isActive,
  isEditing,
  onSelect,
  onStartEdit,
  onStopEdit,
  onChange,
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

  return (
    <td
      className={isActive ? 'cell cell_active' : 'cell'}
      onClick={onSelect}
      onDoubleClick={onStartEdit}
    >
      {value}
    </td>
  );
});

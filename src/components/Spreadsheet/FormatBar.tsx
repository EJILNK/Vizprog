import type { CellFormat, NumberFormat } from '@features/spreadsheet/types';

type FormatBarProps = {
  activeFormat?: CellFormat;
  onToggleBold: () => void;
  onToggleItalic: () => void;
  onToggleUnderline: () => void;
  onTextColorChange: (color: string) => void;
  onBackgroundColorChange: (color: string) => void;
  onTextAlignChange: (align: 'left' | 'center' | 'right') => void;
  onNumberFormatChange: (format: NumberFormat) => void;
};

export function FormatBar({
  activeFormat,
  onToggleBold,
  onToggleItalic,
  onToggleUnderline,
  onTextColorChange,
  onBackgroundColorChange,
  onTextAlignChange,
  onNumberFormatChange,
}: FormatBarProps) {
  return (
    <div className="format_bar">
      <button
        type="button"
        className={activeFormat?.isBold ? 'format_bar_button active' : 'format_bar_button'}
        onClick={onToggleBold}
      >
        B
      </button>

      <button
        type="button"
        className={activeFormat?.isItalic ? 'format_bar_button active' : 'format_bar_button'}
        onClick={onToggleItalic}
      >
        I
      </button>

      <button
        type="button"
        className={activeFormat?.isUnderline ? 'format_bar_button active' : 'format_bar_button'}
        onClick={onToggleUnderline}
      >
        U
      </button>
      <label className="format_bar_color">
        Текст:
        <input
          type="color"
          value={activeFormat?.textColor ?? '#000000'}
          onChange={(event) => onTextColorChange(event.target.value)}
        />
      </label>

      <label className="format_bar_color">
        Фон:
        <input
          type="color"
          value={activeFormat?.backgroundColor ?? '#ffffff'}
          onChange={(event) => onBackgroundColorChange(event.target.value)}
        />
      </label>

      <button
        type="button"
        className={
          activeFormat?.textAlign === 'left' || !activeFormat?.textAlign
            ? 'format_bar_button active'
            : 'format_bar_button'
        }
        onClick={() => onTextAlignChange('left')}
      >
        Слева
      </button>

      <button
        type="button"
        className={
          activeFormat?.textAlign === 'center' ? 'format_bar_button active' : 'format_bar_button'
        }
        onClick={() => onTextAlignChange('center')}
      >
        По центру
      </button>

      <button
        type="button"
        className={
          activeFormat?.textAlign === 'right' ? 'format_bar_button active' : 'format_bar_button'
        }
        onClick={() => onTextAlignChange('right')}
      >
        Справа
      </button>

      <label className="format_bar_select">
        Формат
        <select
          value={activeFormat?.numberFormat ?? 'default'}
          onChange={(event) => onNumberFormatChange(event.target.value as NumberFormat)}
        >
          <option value="default">Обычный</option>
          <option value="percent">Процент</option>
          <option value="currency">Валюта</option>
        </select>
      </label>
    </div>
  );
}

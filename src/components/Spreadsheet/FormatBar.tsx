import type { CellFormat } from '@features/spreadsheet/types';

type FormatBarProps = {
  activeFormat?: CellFormat;
  onToggleBold: () => void;
  onToggleItalic: () => void;
  onToggleUnderline: () => void;
};

export function FormatBar({
  activeFormat,
  onToggleBold,
  onToggleItalic,
  onToggleUnderline,
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
    </div>
  );
}

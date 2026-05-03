type FormulBarProps = {
  activeCellId: string;
  value: string;
  onChange: (value: string) => void;
};

export function FormulBar({ activeCellId, value, onChange }: FormulBarProps) {
  return (
    <div className="formul_bar">
      <div className="formul_bar_cell_name">{activeCellId}</div>
      <input
        className="formul_bar_input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

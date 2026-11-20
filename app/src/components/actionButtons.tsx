interface ActionButtonsProps {
  onCreateTable: () => void;
  onEditTable: () => void;
  onImportTables: () => void;
  onExportTables: () => void;
}

//retro look
const base =
  "min-h-[48px] px-3 py-2 rounded-theme border-[length:var(--border-w)] border-ink " +
  "font-body text-[15px] font-bold uppercase tracking-wider text-ink " +
  "shadow-hard transition-[transform,box-shadow] duration-75 " +
  "hover:-translate-x-px hover:-translate-y-px hover:shadow-[calc(var(--shadow-offset)*1.25)_calc(var(--shadow-offset)*1.25)_0_var(--color-ink)] " +
  "active:translate-x-1 active:translate-y-1 active:shadow-none";

export default function ActionButtons({
  onCreateTable,
  onEditTable,
  onImportTables,
  onExportTables,
}: ActionButtonsProps) { // Holds the table buttons
  const buttons = [
    { label: "Create",  onClick: onCreateTable,   color: "bg-button-accent !text-accent-fg" },
    { label: "Edit",    onClick: onEditTable,     color: "bg-edit !text-accent-fg" },
    { label: "Import",  onClick: onImportTables,  color: "bg-paper" },
    { label: "Export",  onClick: onExportTables,  color: "bg-header !text-header-fg" },
  ];

  return (
    <div className="grid grid-cols-2 gap-[14px] mt-auto">
      {buttons.map(({ label, onClick, color }) => (
        <button key={label} type="button" onClick={onClick} className={`${base} ${color}`}>
          {label}
        </button>
      ))}
    </div>
  );
}
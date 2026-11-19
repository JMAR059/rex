interface ActionButtonsProps {
  onCreateTable: () => void;
  onEditTable: () => void;
  onImportTables: () => void;
  onExportTables: () => void;
}

//retro look
const base =
  "min-h-[48px] px-3 py-2 rounded-none border-[3px] border-[#3A2814] " +
  "font-mono text-[15px] font-bold uppercase tracking-wider text-[#3A2814] " +
  "shadow-[4px_4px_0_#3A2814] transition-[transform,box-shadow] duration-75 " +
  "hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_#3A2814] " +
  "active:translate-x-1 active:translate-y-1 active:shadow-none";

export default function ActionButtons({
  onCreateTable,
  onEditTable,
  onImportTables,
  onExportTables,
}: ActionButtonsProps) { // Holds the table buttons
  const buttons = [
    { label: "Create",  onClick: onCreateTable,   color: "bg-[#EA851A]" },
    { label: "Edit",    onClick: onEditTable,     color: "bg-[#F2A921]" },
    { label: "Import",  onClick: onImportTables,  color: "bg-[#FFFDB1]" },
    { label: "Export",  onClick: onExportTables,  color: "bg-[#7A4A23] !text-[#FFFDB1]" },
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
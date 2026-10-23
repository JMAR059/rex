interface ActionButtonsProps {
  onViewHistory: () => void;
  onCreateTable: () => void;
  onEditTable: () => void;
  onImportTables: () => void;
  onExportTables: () => void;
}

export default function ActionButtons({
  onViewHistory,
  onEditTable,
  onImportTables,
  onExportTables,
}: ActionButtonsProps) {
  return (
    <div className="flex flex-col gap-2 mt-auto">
      <button
        onClick={onViewHistory}
        className="px-3 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-700"
      >
        View History
      </button>
      <button
        onClick={onEditTable}
        className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-700"
      >
        Edit Table
      </button>
      <button
        onClick={onImportTables}
        className="px-3 py-2 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-700"
      >
        Import Tables
      </button>
      <button
        onClick={onExportTables}
        className="px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-700"
      >
        Export Tables
      </button>
    </div>
  );
}

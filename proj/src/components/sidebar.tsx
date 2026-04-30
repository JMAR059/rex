import ActionButtons from './actionButtons';

interface TableRow {
  id: number;
  [key: string]: string | number;
}

interface PresetTable {
  name: string;
  columns: string[];
  rows: TableRow[];
}

interface SidebarProps {
  isImportMode: boolean;
  onCancelImport: () => void;
  onFileImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isTableDropdownOpen: boolean;
  onToggleDropdown: () => void;
  selectedTables: string[];
  allTables: PresetTable[];
  onTableSelect: (tableName: string) => void;
  onViewHistory: () => void;
  onEditTable: () => void;
  onImportTables: () => void;
  onExportTables: () => void;
}

const getColumnType = (columnName: string, table: PresetTable): string => {
  if (table.rows.length === 0) return 'unknown';
  const firstValue = table.rows[0][columnName];
  if (typeof firstValue === 'number') {
    return Number.isInteger(firstValue) ? 'number' : 'number';
  }
  if (typeof firstValue === 'string') return 'string';
  if (typeof firstValue === 'boolean') return 'boolean';
  return 'unknown';
};

export default function Sidebar({
  isImportMode,
  onCancelImport,
  onFileImport,
  isTableDropdownOpen,
  onToggleDropdown,
  selectedTables,
  allTables,
  onTableSelect,
  onViewHistory,
  onEditTable,
  onImportTables,
  onExportTables,
}: SidebarProps) {
    console.log(allTables);
    return (
    <div className="w-64 bg-gray-200 border-r border-gray-300 p-3 flex flex-col gap-3 overflow-y-auto">
      {/* Import File Dialog */}
      {isImportMode && (
        <div className="flex flex-col gap-2 p-3 bg-blue-50 rounded border border-blue-200">
          <label className="font-semibold text-sm">Import JSON:</label>
          <input
            type="file"
            accept=".json"
            onChange={onFileImport}
            className="text-xs"
          />
          <button
            onClick={onCancelImport}
            className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Table List */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onToggleDropdown}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-left flex justify-between items-center hover:bg-gray-50"
        >
          <span>
            Select Tables ({selectedTables.length > 0 ? selectedTables.join(', ') : 'None'})
          </span>
          <span className="text-gray-500">{isTableDropdownOpen ? '▲' : '▼'}</span>
        </button>
        
        {isTableDropdownOpen && (
          <div className="border border-gray-300 rounded bg-white max-h-60 overflow-y-auto">
            {allTables.sort((a: PresetTable, b: PresetTable) => a.name.localeCompare(b.name)).map((preset) => (
              <div
                key={preset.name}
                onClick={() => onTableSelect(preset.name)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedTables.indexOf(preset.name) !== -1}
                  readOnly
                  className="cursor-pointer"
                />
                <span>{preset.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Tables Schema Display */}
      {selectedTables.length > 0 && (
        <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-300">
          <label className="font-semibold text-sm">Schema:</label>
          {selectedTables.sort().map((tableName) => {
            const table = allTables.find((t: PresetTable) => t.name === tableName);
            if (!table) return null;
            return (
              <div key={tableName} className="mb-2">
                <div className="font-semibold text-sm mb-1">{tableName}</div>
                <div className="ml-3 text-xs">
                  {table.columns.map((col) => (
                    <div key={col} className="flex justify-between py-0.5">
                      <span className="text-gray-700">{col}</span>
                      <span className="text-gray-500">{getColumnType(col, table)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Buttons */}
      <ActionButtons
        onViewHistory={onViewHistory}
        onEditTable={onEditTable}
        onImportTables={onImportTables}
        onExportTables={onExportTables}
      />
    </div>
  );
}

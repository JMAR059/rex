interface TableRow {
  id: number;
  [key: string]: string | number;
}

interface PresetTable {
  name: string;
  columns: string[];
  rows: TableRow[];
}

interface TableEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPreset: string;
  allTables: PresetTable[];
  onLoadPreset: (presetName: string) => void;
  columns: string[];
  rows: TableRow[];
  newColumnName: string;
  onNewColumnNameChange: (value: string) => void;
  onAddColumn: () => void;
  onRemoveColumn: (index: number) => void;
  onUpdateCell: (rowId: number, column: string, value: string) => void;
  onRemoveRow: (rowId: number) => void;
  onAddRow: () => void;
}

export default function TableEditorModal({
  isOpen,
  onClose,
  selectedPreset,
  allTables,
  onLoadPreset,
  columns,
  rows,
  newColumnName,
  onNewColumnNameChange,
  onAddColumn,
  onRemoveColumn,
  onUpdateCell,
  onRemoveRow,
  onAddRow,
}: TableEditorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Table Data</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Table Selector */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Select Table to Edit:</label>
            <select
              value={selectedPreset}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onLoadPreset(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              {allTables.map((preset) => (
                <option key={preset.name} value={preset.name}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newColumnName}
              onChange={(e) => onNewColumnNameChange(e.target.value)}
              placeholder="New column name"
              className="px-2 py-1 border rounded-md"
            />
            <button
              onClick={onAddColumn}
              className="px-4 py-1 bg-green-500 text-white rounded-md hover:bg-green-700"
            >
              Add Column
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  {columns.map((col, index) => (
                    <th key={index} className="border border-gray-300 p-2 bg-gray-100">
                      {col}
                      <button
                        onClick={() => onRemoveColumn(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </th>
                  ))}
                  <th className="border border-gray-300 p-2 bg-gray-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    {columns.map((col) => (
                      <td key={`${row.id}-${col}`} className="border border-gray-300 p-2">
                        <input
                          type="text"
                          value={row[col] || ''}
                          onChange={(e) => onUpdateCell(row.id, col, e.target.value)}
                          className="w-full px-2 py-1 border rounded-md"
                        />
                      </td>
                    ))}
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={() => onRemoveRow(row.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-2 justify-between">
            <button
              onClick={onAddRow}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            >
              Add Row
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

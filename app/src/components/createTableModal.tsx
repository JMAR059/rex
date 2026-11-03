import { useState } from 'react';

interface TableRow {
  id: number;
  [key: string]: string | number;
}

interface CreateTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: string[];
  rows: TableRow[];
  tableName: string;
  onTableNameChange: (value: string) => void;
  onColumnNameChange: (index: number, newName: string) => void;
  newColumnName: string;
  onNewColumnNameChange: (value: string) => void;
  onAddColumn: () => void;
  onRemoveColumn: (index: number) => void;
  onUpdateCell: (rowId: number, column: string, value: string) => void;
  onRemoveRow: (rowId: number) => void;
  onAddRow: () => void;
  onSave: () => void;
}

export default function CreateTableModal({
  isOpen,
  onClose,
  columns,
  rows,
  tableName,
  onTableNameChange,
  onColumnNameChange,
  newColumnName,
  onNewColumnNameChange,
  onAddColumn,
  onRemoveColumn,
  onUpdateCell,
  onRemoveRow,
  onAddRow,
  onSave,
}: CreateTableModalProps) {
  const [editingColumnIndex, setEditingColumnIndex] = useState<number | null>(null);
  const [editingColumnName, setEditingColumnName] = useState<string>('');

  const handleColumnNameClick = (index: number) => {
    setEditingColumnIndex(index);
    setEditingColumnName(columns[index]);
  };

  const handleColumnNameBlur = () => {
    if (editingColumnIndex !== null && editingColumnName.trim()) {
      onColumnNameChange(editingColumnIndex, editingColumnName);
    }
    setEditingColumnIndex(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Table</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Table Name Input */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Table Name:</label>
            <input
              type="text"
              value={tableName}
              onChange={(e) => onTableNameChange(e.target.value)}
              placeholder="Enter table name"
              className="px-3 py-2 border rounded-md"
            />
          </div>

          {/* Add Column */}
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

          {/* Table Editor */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  {columns.map((col, index) => (
                    <th key={`name-${index}`} className="border border-gray-300 p-2 bg-gray-100">
                      {editingColumnIndex === index ? (
                        <input
                          type="text"
                          value={editingColumnName}
                          onChange={(e) => setEditingColumnName(e.target.value)}
                          onBlur={handleColumnNameBlur}
                          onKeyPress={(e) => e.key === 'Enter' && handleColumnNameBlur()}
                          autoFocus
                          className="w-full px-2 py-1 border rounded-md"
                        />
                      ) : (
                        <div
                          onClick={() => handleColumnNameClick(index)}
                          className="cursor-pointer hover:bg-gray-200 px-2 py-1 rounded"
                        >
                          {col}
                        </div>
                      )}
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

          {/* Action Buttons */}
          <div className="flex gap-2 justify-between">
            <button
              onClick={onAddRow}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            >
              Add Row
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
              >
                Create Table
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

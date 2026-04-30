import { useEffect, useState } from 'react';

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
  onApplyJsonTableData: (table: PresetTable) => void;
}

export default function TableEditorModal({
  isOpen,
  onClose,
  selectedPreset,
  allTables,
  onLoadPreset,
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
  onApplyJsonTableData,
}: TableEditorModalProps) {
  const [editingColumnIndex, setEditingColumnIndex] = useState<number | null>(null);
  const [editingColumnName, setEditingColumnName] = useState<string>('');
  const [editingTableName, setEditingTableName] = useState<boolean>(false);
  const [tempTableName, setTempTableName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'table' | 'json'>('table');
  const [jsonText, setJsonText] = useState<string>('');
  const [jsonError, setJsonError] = useState<string>('');

  const buildJsonPayload = (): string => {
    return JSON.stringify(
      {
        name: tableName,
        columns,
        rows,
      },
      null,
      2
    );
  };

  useEffect(() => {
    if (isOpen) {
      setJsonText(buildJsonPayload());
      setJsonError('');
      setActiveTab('table');
    }
  }, [isOpen]);

  useEffect(() => {
    if (activeTab === 'json') {
      setJsonText(buildJsonPayload());
      setJsonError('');
    }
  }, [activeTab, tableName, columns, rows]);

  if (!isOpen) return null;

  const handleColumnNameClick = (index: number) => {
    setEditingColumnIndex(index);
    setEditingColumnName(columns[index]);
  };

  const handleColumnNameBlur = () => {
    if (editingColumnIndex !== null && editingColumnName.trim() !== '') {
      onColumnNameChange(editingColumnIndex, editingColumnName);
    }
    setEditingColumnIndex(null);
  };

  const handleTableNameClick = () => {
    setEditingTableName(true);
    setTempTableName(tableName);
  };

  const handleTableNameBlur = () => {
    if (tempTableName.trim() !== '') {
      onTableNameChange(tempTableName);
    }
    setEditingTableName(false);
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonText) as Partial<PresetTable>;
      const parsedName = typeof parsed.name === 'string' ? parsed.name.trim() : '';
      const parsedColumns = Array.isArray(parsed.columns)
        ? parsed.columns.filter((col): col is string => typeof col === 'string' && col.trim() !== '')
        : null;
      const parsedRows = Array.isArray(parsed.rows) ? parsed.rows : null;

      if (!parsedName) {
        setJsonError('JSON must include a non-empty "name" string.');
        return;
      }
      if (!parsedColumns || parsedColumns.length === 0) {
        setJsonError('JSON must include a non-empty "columns" string array.');
        return;
      }
      
      // Check for duplicate column names
      const columnSet = new Set<string>();
      const duplicates: string[] = [];
      parsedColumns.forEach((col) => {
        if (columnSet.has(col)) {
          duplicates.push(col);
        }
        columnSet.add(col);
      });
      if (duplicates.length > 0) {
        setJsonError(`Duplicate column names found: ${duplicates.join(', ')}`);
        return;
      }

      if (!parsedRows) {
        setJsonError('JSON must include a "rows" array.');
        return;
      }
      
      if (parsedRows.length === 0) {
        setJsonError('The "rows" array cannot be empty.');
        return;
      }

      const normalizedRows: TableRow[] = parsedRows.map((row, index) => {
        if (row === null || typeof row !== 'object' || Array.isArray(row)) {
          throw new Error(`Row at index ${index} must be a valid object, not ${Array.isArray(row) ? 'an array' : typeof row}`);
        }
        const rawRow = row && typeof row === 'object' ? (row as Record<string, string | number>) : {};
        const normalizedRow: TableRow = {
          id: typeof rawRow.id === 'number' ? rawRow.id : index + 1,
        };

        parsedColumns.forEach((col) => {
          const value = rawRow[col];
          normalizedRow[col] = typeof value === 'string' || typeof value === 'number' ? value : '';
        });

        return normalizedRow;
      });

      onApplyJsonTableData({
        name: parsedName,
        columns: parsedColumns,
        rows: normalizedRows,
      });
      setJsonError('');
      setActiveTab('table');
    } catch (error) {
      const errorMsg = (error as Error).message;
      if (errorMsg.includes('Unexpected token')) {
        setJsonError(`JSON syntax error: Check for missing commas, quotes, or brackets. ${errorMsg}`);
      } else if (errorMsg.includes('JSON.parse')) {
        setJsonError(`JSON parsing failed: ${errorMsg}`);
      } else {
        setJsonError(`Validation error: ${errorMsg}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[95vh] overflow-y-auto">
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
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-2 text-sm font-semibold ${
                activeTab === 'table'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-2 text-sm font-semibold ${
                activeTab === 'json'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              JSON
            </button>
          </div>

          {activeTab === 'json' ? (
            <div className="flex flex-col gap-3">
              <label className="font-semibold">Edit table JSON:</label>
              <div className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                <p className="font-semibold mb-1">Expected JSON format</p>
                <p>Use an object with <span className="font-mono">name</span>, <span className="font-mono">columns</span>, and <span className="font-mono">rows</span>.</p>
                <pre className="mt-2 p-2 bg-white border border-gray-200 rounded text-xs overflow-auto font-mono">{`{
  "name": "Courses",
  "columns": ["CourseID", "Name", "Credits"],
  "rows": [
    { "id": 1, "CourseID": "CS1100", "Name": "CS1", "Credits": 4 },
    { "id": 2, "CourseID": "MATH1100", "Name": "Calc 1", "Credits": 4 }
  ]
}`}</pre>
              </div>
              <textarea
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  if (jsonError) {
                    setJsonError('');
                  }
                }}
                className="w-full min-h-[560px] px-3 py-2 border rounded-md font-mono text-sm"
              />
              {jsonError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {jsonError}
                </div>
              )}
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => setJsonText(buildJsonPayload())}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
                >
                  Reset JSON
                </button>
                <button
                  onClick={handleApplyJson}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                >
                  Apply JSON
                </button>
              </div>
            </div>
          ) : (
            <>
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

          {/* Table Name Editor */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Table Name:</label>
            {editingTableName ? (
              <input
                type="text"
                value={tempTableName}
                onChange={(e) => setTempTableName(e.target.value)}
                onBlur={handleTableNameBlur}
                onKeyPress={(e) => e.key === 'Enter' && handleTableNameBlur()}
                autoFocus
                className="px-3 py-2 border rounded-md"
              />
            ) : (
              <div
                onClick={handleTableNameClick}
                className="px-3 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
              >
                {tableName}
              </div>
            )}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

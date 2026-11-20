import { useEffect, useState } from 'react';

const buttonBase =
  "font-['Space_Mono',monospace] font-bold uppercase tracking-wider border-[3px] border-[#3A2814] " +
  'rounded-none shadow-[4px_4px_0_#3A2814] cursor-pointer transition-[transform,box-shadow,background-color] duration-75 ' +
  'hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_#3A2814] ' +
  'active:translate-x-1 active:translate-y-1 active:shadow-none ' +
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-dashed focus-visible:outline-offset-[3px] focus-visible:outline-[#3A2814]';
const paperButton = `${buttonBase} bg-[#FFFDB1] text-[#3A2814] hover:bg-[#EA851A]`;
const darkButton = `${buttonBase} bg-[#7A4A23] text-[#FFFDB1] hover:bg-[#666347]`;
const fieldClass =
  'w-full bg-[#FFFDB1] text-[#3A2814] border-[3px] border-[#3A2814] rounded-none px-3 py-2 ' +
  'placeholder:text-[#774D2E] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-dashed focus-visible:outline-offset-[2px] focus-visible:outline-[#3A2814]';

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
  onCreateNewTable: (table: PresetTable) => void;
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
  onCreateNewTable,
}: TableEditorModalProps) {
  const [editingColumnIndex, setEditingColumnIndex] = useState<number | null>(null);
  const [editingColumnName, setEditingColumnName] = useState<string>('');
  const [editingTableName, setEditingTableName] = useState<boolean>(false);
  const [tempTableName, setTempTableName] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'table' | 'json'>('table');
  const [jsonText, setJsonText] = useState<string>('');
  const [jsonError, setJsonError] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newTableName, setNewTableName] = useState<string>('');
  const [newTableColumns, setNewTableColumns] = useState<string>('Column1, Column2');
  const [createTableError, setCreateTableError] = useState<string>('');

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

  const buildEmptyTableJson = (): string => {
    const columnList = newTableColumns
      .split(',')
      .map((col) => col.trim())
      .filter((col) => col !== '');
    
    return JSON.stringify(
      {
        name: newTableName || 'NewTable',
        columns: columnList.length > 0 ? columnList : ['Column1'],
        rows: [],
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
      setShowCreateForm(selectedPreset === 'new_table');
      if (selectedPreset === 'new_table') {
        setNewTableName('');
        setNewTableColumns('Column1, Column2');
        setCreateTableError('');
      }
    }
  }, [isOpen, selectedPreset]);

  useEffect(() => {
    if (activeTab === 'json') {
      if (selectedPreset === 'new_table' && showCreateForm) {
        setJsonText(buildEmptyTableJson());
      } else {
        setJsonText(buildJsonPayload());
      }
      setJsonError('');
    }
  }, [activeTab, tableName, columns, rows, selectedPreset, showCreateForm, newTableName, newTableColumns]);

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

  const handleCreateNewTable = () => {
    const trimmedName = newTableName.trim();
    const columnList = newTableColumns
      .split(',')
      .map((col) => col.trim())
      .filter((col) => col !== '');

    setCreateTableError('');

    if (!trimmedName) {
      setCreateTableError('Table name cannot be empty.');
      return;
    }

    if (columnList.length === 0) {
      setCreateTableError('At least one column is required.');
      return;
    }

    // Check for duplicate column names
    const duplicates = columnList.filter(
      (col, index) => columnList.indexOf(col) !== index
    );
    if (duplicates.length > 0) {
      setCreateTableError(`Duplicate columns found: ${duplicates.join(', ')}`);
      return;
    }

    // Check if table name already exists
    if (allTables.some((t) => t.name === trimmedName)) {
      setCreateTableError(
        `A table named "${trimmedName}" already exists. Please choose a different name.`
      );
      return;
    }

    // Create the new table
    const newTable: PresetTable = {
      name: trimmedName,
      columns: columnList,
      rows: [{ id: 1 }], // Start with one empty row
    };

    onCreateNewTable(newTable);
    setNewTableName('');
    setNewTableColumns('Column1, Column2');
    setCreateTableError('');
    setShowCreateForm(false);
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
    <div className="fixed inset-0 bg-[#3A2814]/90 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-[#C4A76B] text-[#3A2814] font-['Space_Mono',monospace] border-[5px] border-[#3A2814] shadow-[8px_8px_0_#3A2814] p-5 sm:p-7 w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5 bg-[#7A4A23] text-[#FFFDB1] border-[3px] border-[#3A2814] px-4 py-2">
          <h2 className="font-['VT323',monospace] text-4xl uppercase tracking-wider">Edit Table Data</h2>
          <button
            onClick={onClose}
            aria-label="Close table editor"
            className={`${paperButton} px-2 text-2xl leading-none`}
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2 border-b-[3px] border-[#3A2814]">
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-2 text-sm font-semibold ${
                activeTab === 'table'
                  ? 'border-b-[5px] border-[#EA851A] text-[#3A2814]'
                  : 'text-[#774D2E] hover:text-[#3A2814]'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-2 text-sm font-semibold ${
                activeTab === 'json'
                  ? 'border-b-[5px] border-[#EA851A] text-[#3A2814]'
                  : 'text-[#774D2E] hover:text-[#3A2814]'
              }`}
            >
              JSON
            </button>
          </div>

          {activeTab === 'json' ? (
            <div className="flex flex-col gap-3">
              <label className="font-bold uppercase tracking-wider">Edit table JSON:</label>
              <div className="text-sm bg-[#FBF4D4] border-[3px] border-[#3A2814] px-3 py-2">
                <p className="font-bold mb-1 uppercase tracking-wider">Expected JSON format</p>
                <p>Use an object with <span className="font-mono">name</span>, <span className="font-mono">columns</span>, and <span className="font-mono">rows</span>.</p>
                <pre className="mt-2 p-2 bg-[#FFFDB1] border-[2px] border-[#3A2814] text-xs overflow-auto font-mono">{`{
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
                className={`${fieldClass} min-h-[420px] font-mono text-sm`}
              />
              {jsonError && (
                <div role="alert" className="text-sm font-bold bg-[#FF3100] text-[#FFFDB1] border-[3px] border-[#3A2814] px-3 py-2">
                  {jsonError}
                </div>
              )}
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => {
                    if (selectedPreset === 'new_table' && showCreateForm) {
                      setJsonText(buildEmptyTableJson());
                    } else {
                      setJsonText(buildJsonPayload());
                    }
                  }}
                  className={`${darkButton} px-4 py-2`}
                >
                  Reset JSON
                </button>
                <button
                  onClick={handleApplyJson}
                  className={`${paperButton} px-4 py-2`}
                >
                  Apply JSON
                </button>
              </div>
            </div>
          ) : (
            <>
          {/* Table Selector */}
          <div className="flex flex-col gap-2">
            <label className="font-bold uppercase tracking-wider">Select Table to Edit:</label>
            <select
              value={selectedPreset}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const value = e.target.value;
                if (value === 'new_table') {
                  onLoadPreset('new_table');
                  setShowCreateForm(true);
                  setNewTableName('');
                  setNewTableColumns('Column1, Column2');
                  setCreateTableError('');
                } else {
                  onLoadPreset(value);
                }
              }}
              className={fieldClass}
            >
              {allTables.map((preset) => (
                <option key={preset.name} value={preset.name}>
                  {preset.name}
                </option>
              ))}
              <option value="new_table">+ New Table</option>
            </select>
          </div>


          {/* Create New Table Form - shown when new_table is selected */}
          {selectedPreset === 'new_table' && showCreateForm && (
            <div className="border-y-[3px] border-[#3A2814] py-4 flex flex-col gap-3">
              <div>
                <label className="font-bold text-sm uppercase tracking-wider">New Table Name:</label>
                <input
                  type="text"
                  value={newTableName}
                  onChange={(e) => {
                    setNewTableName(e.target.value);
                    if (createTableError) setCreateTableError('');
                  }}
                  placeholder="e.g., Employees"
                  className={`${fieldClass} mt-1`}
                />
              </div>
              <div>
                <label className="font-bold text-sm uppercase tracking-wider">Columns (comma-separated):</label>
                <input
                  type="text"
                  value={newTableColumns}
                  onChange={(e) => {
                    setNewTableColumns(e.target.value);
                    if (createTableError) setCreateTableError('');
                  }}
                  placeholder="e.g., ID, Name, Department"
                  className={`${fieldClass} mt-1`}
                />
              </div>
              {createTableError && (
                <div role="alert" className="text-sm font-bold bg-[#FF3100] text-[#FFFDB1] border-[3px] border-[#3A2814] px-3 py-2">
                  {createTableError}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleCreateNewTable}
                  className={`flex-1 px-3 py-2 bg-[#70CAA2] text-[#3A2814] ${buttonBase}`}
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    const firstTable = allTables[0]?.name || 'Courses';
                    onLoadPreset(firstTable);
                    setShowCreateForm(false);
                  }}
                  className={`flex-1 px-3 py-2 ${darkButton}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Table Name Editor */}
          <div className="flex flex-col gap-2">
            <label className="font-bold uppercase tracking-wider">Table Name:</label>
            {editingTableName ? (
              <input
                type="text"
                value={tempTableName}
                onChange={(e) => setTempTableName(e.target.value)}
                onBlur={handleTableNameBlur}
                onKeyDown={(e) => e.key === 'Enter' && handleTableNameBlur()}
                autoFocus
                className={fieldClass}
              />
            ) : (
              <div
                onClick={handleTableNameClick}
                className={`${fieldClass} cursor-pointer hover:bg-[#FBF4D4]`}
              >
                {tableName}
              </div>
            )}
          </div>

          <div className="flex items-stretch gap-2">
            <input
              type="text"
              value={newColumnName}
              onChange={(e) => onNewColumnNameChange(e.target.value)}
              placeholder="New column name"
              className={`${fieldClass} min-w-0 flex-1`}
            />
            <button
              onClick={onAddColumn}
              className={`shrink-0 whitespace-nowrap px-4 py-2 bg-[#70CAA2] text-[#3A2814] ${buttonBase}`}
            >
              Add Column
            </button>
          </div>

          <div className="overflow-x-auto max-h-[45vh] border-[3px] border-[#3A2814]">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  {columns.map((col, index) => (
                    <th key={`name-${index}`} className="border-b-[3px] border-r-[2px] border-[#3A2814] p-2 bg-[#666347] text-[#FFFDB1]">
                      {editingColumnIndex === index ? (
                        <input
                          type="text"
                          value={editingColumnName}
                          onChange={(e) => setEditingColumnName(e.target.value)}
                          onBlur={handleColumnNameBlur}
                          onKeyDown={(e) => e.key === 'Enter' && handleColumnNameBlur()}
                          autoFocus
                          className={`${fieldClass} min-w-28`}
                        />
                      ) : (
                        <div
                          onClick={() => handleColumnNameClick(index)}
                          className="cursor-pointer hover:bg-[#7A4A23] px-2 py-1"
                        >
                          {col}
                        </div>
                      )}
                      <button
                        onClick={() => onRemoveColumn(index)}
                        aria-label={`Remove column ${col}`}
                        className={`ml-2 whitespace-nowrap bg-[#FF3100] text-[#FFFDB1] px-2 py-1 text-xs ${buttonBase}`}
                      >
                        Remove
                      </button>
                    </th>
                  ))}
                  <th className="border-b-[3px] border-[#3A2814] p-2 bg-[#666347] text-[#FFFDB1]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    {columns.map((col) => (
                      <td key={`${row.id}-${col}`} className={`border-b-2 border-r-2 border-[#3A2814] p-2 ${row.id % 2 === 0 ? 'bg-[#F4E8B0]' : 'bg-[#FBF4D4]'}`}>
                        <input
                          type="text"
                          value={row[col] || ''}
                          onChange={(e) => onUpdateCell(row.id, col, e.target.value)}
                          className={`${fieldClass} min-w-28`}
                        />
                      </td>
                    ))}
                    <td className="border-b-2 border-[#3A2814] p-2 bg-[#FBF4D4]">
                      <button
                        onClick={() => onRemoveRow(row.id)}
                        aria-label={`Remove row ${row.id}`}
                        className={`whitespace-nowrap bg-[#FF3100] text-[#FFFDB1] px-2 py-1 text-xs ${buttonBase}`}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3 justify-between">
            <button
              onClick={onAddRow}
              className={`${paperButton} px-4 py-2`}
            >
              Add Row
            </button>
            <button
              onClick={onClose}
              className={`${darkButton} px-4 py-2`}
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

import { useState } from 'react';
import ActionButtons from './actionButtons';

const apiUrl = "http://localhost:8000/relational_algebra";

interface QueryProps {
  replaceResult: (resp: {result: string}) => void;
  addToHistory: (query: string, resp:{result: string}) => void;
}

interface TableRow {
  id: number;
  [key: string]: string | number;
}

interface PresetTable {
  name: string;
  columns: string[];
  rows: TableRow[];
}

// Preset tables
const PRESET_TABLES: PresetTable[] = [
  {
    name: "Students",
    columns: ["StudentID", "Name", "Age", "Major"],
    rows: [
      { id: 1, StudentID: "S001", Name: "Alice", Age: 20, Major: "CS" },
      { id: 2, StudentID: "S002", Name: "Bob", Age: 21, Major: "Math" },
      { id: 3, StudentID: "S003", Name: "Charlie", Age: 19, Major: "CS" },
    ]
  },
  {
    name: "Courses",
    columns: ["CourseID", "CourseName", "Credits"],
    rows: [
      { id: 1, CourseID: "CS101", CourseName: "Intro to CS", Credits: 3 },
      { id: 2, CourseID: "MATH201", CourseName: "Calculus", Credits: 4 },
      { id: 3, CourseID: "CS202", CourseName: "Data Structures", Credits: 4 },
    ]
  },
  {
    name: "Employees",
    columns: ["EmpID", "Name", "Department", "Salary"],
    rows: [
      { id: 1, EmpID: "E001", Name: "John", Department: "Sales", Salary: 50000 },
      { id: 2, EmpID: "E002", Name: "Jane", Department: "Engineering", Salary: 75000 },
      { id: 3, EmpID: "E003", Name: "Mike", Department: "HR", Salary: 60000 },
    ]
  }
];

interface TableData {
  name: string;
  columns: string[];
  rows: TableRow[];
}

async function executeQuery(tables: TableData[], queries: string[]): Promise<{result: string}> {
  // Transform tables to { tableName: {column1: [values...], column2: [values...]}, ... }
  const relations: Record<string, Record<string, (string | number)[]>> = {};
  
  tables.forEach(table => {
    const columnData: Record<string, (string | number)[]> = {};
    table.columns.forEach(col => {
      columnData[col] = table.rows.map(row => row[col] || '');
    });
    relations[table.name] = columnData;
  });
  
  console.log("Sending data to API:", { relations, queries });
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ relations, queries }),
  });
  const data = await response.json();
  return {"result": JSON.stringify(data.results)};
}

const handleOnClick = async (
  tables: TableData[],
  queries: string[], 
  replaceResult: QueryProps['replaceResult'], 
  addToHistory: QueryProps['addToHistory']
) => {
  const resp = await executeQuery(tables, queries);
  const queryStr = queries.join('\n');
  replaceResult(resp);
  addToHistory(queryStr, resp);
};

const QueryBody: React.FC<QueryProps> = ({ replaceResult, addToHistory }) => {
  const studentsPreset = PRESET_TABLES.find((p: PresetTable) => p.name === 'Students');
  const [columns, setColumns] = useState<string[]>(studentsPreset?.columns || ['Column1', 'Column2']);
  const [rows, setRows] = useState<TableRow[]>(studentsPreset?.rows || [{ id: 1 }]);
  const [newColumnName, setNewColumnName] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [isTableOpen, setIsTableOpen] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('Students');
  const [tableName, setTableName] = useState<string>('Students');
  const [selectedTables, setSelectedTables] = useState<string[]>(['Students']);
  const [importedTables, setImportedTables] = useState<PresetTable[]>([]);
  const [isImportMode, setIsImportMode] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [queryHistory, setQueryHistory] = useState<Array<{query: string, result: string, timestamp: Date}>>([]);
  const [currentResult, setCurrentResult] = useState<string>('');
  const [isTableDropdownOpen, setIsTableDropdownOpen] = useState<boolean>(false);

  const allTables = [...PRESET_TABLES, ...importedTables];

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const content = e.target?.result as string;
        const imported = JSON.parse(content) as PresetTable[];
        
        // Validate the imported data
        if (!Array.isArray(imported)) {
          alert('Invalid file format: Expected an array of tables');
          return;
        }

        // Add ids to rows if they don't have them
        const processedTables = imported.map(table => ({
          ...table,
          rows: table.rows.map((row, index) => ({
            id: row.id || index + 1,
            ...row
          }))
        }));

        setImportedTables(processedTables);
        setIsImportMode(false);
        alert(`Successfully imported ${processedTables.length} table(s)`);
      } catch (error) {
        alert('Error parsing JSON file: ' + (error as Error).message);
      }
    };
    reader.readAsText(file);
  };

  const handleExportTables = () => {
    const tablesToExport: PresetTable[] = [];
    
    selectedTables.forEach(tableName => {
      const table = allTables.find((t: PresetTable) => t.name === tableName);
      if (table) {
        tablesToExport.push(table);
      }
    });

    if (tablesToExport.length === 0) {
      alert('No tables selected for export');
      return;
    }

    const json = JSON.stringify(tablesToExport, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tables.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadPreset = (presetName: string) => {
    if (presetName === 'import') {
      setIsImportMode(true);
      return;
    }
    
    if (presetName === 'custom') {
      setColumns(['Column1', 'Column2']);
      setRows([{ id: 1 }]);
      setTableName('CustomTable');
    } else {
      const preset = allTables.find((p: PresetTable) => p.name === presetName);
      if (preset) {
        setColumns(preset.columns);
        setRows(preset.rows);
        setTableName(presetName);
      }
    }
    setSelectedPreset(presetName);
  };

  const toggleTableSelection = (tableName: string) => {
    setSelectedTables(prev => 
      prev.indexOf(tableName) !== -1
        ? prev.filter((t: string) => t !== tableName)
        : [...prev, tableName]
    );
  };

  const getSelectedTablesData = (): TableData[] => {
    const tablesData: TableData[] = [];
    
    // Add custom table if it's being viewed
    if (selectedPreset === 'custom' && selectedTables.indexOf('CustomTable') !== -1) {
      tablesData.push({ name: tableName, columns, rows });
    }
    
    // Add all selected tables (preset + imported)
    selectedTables.forEach(selectedName => {
      const table = allTables.find((t: PresetTable) => t.name === selectedName);
      if (table) {
        tablesData.push({ name: table.name, columns: table.columns, rows: table.rows });
      }
    });
    
    return tablesData;
  };

  const addColumn = () => {
    if (newColumnName.trim()) {
      setColumns([...columns, newColumnName]);
      setNewColumnName('');
    }
  };

  const removeColumn = (index: number) => {
    const newColumns = columns.filter((_, i) => i !== index);
    setColumns(newColumns);
    const newRows = rows.map(row => {
      const { [columns[index]]: _, ...rest } = row;
      return rest;
    });
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, { id: rows.length + 1 }]);
  };

  const removeRow = (id: number) => {
    setRows(rows.filter(row => row.id !== id));
  };

  const updateCell = (rowId: number, column: string, value: string) => {
    setRows(rows.map(row => 
      row.id === rowId ? { ...row, [column]: value } : row
    ));
  };

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

  const formatResultAsTable = (resultJson: string): string => {
    try {
      const data = JSON.parse(resultJson);
      
      // Check if data is empty
      if (!data || typeof data !== 'object') {
        return 'No results';
      }

      const columns = Object.keys(data);
      if (columns.length === 0) {
        return 'No results';
      }

      // Get number of rows (assumes all columns have same length)
      const firstColumn = data[columns[0]];
      const rowCount = Object.keys(firstColumn).length;

      if (rowCount === 0) {
        return 'No results';
      }

      // Helper function to pad strings (alternative to padEnd)
      const padString = (str: string, length: number): string => {
        while (str.length < length) {
          str += ' ';
        }
        return str;
      };

      // Calculate max width for each column
      const columnWidths: { [key: string]: number } = {};
      columns.forEach((col: string) => {
        let maxWidth = col.length;
        for (let i = 0; i < rowCount; i++) {
          const value = String(data[col][i.toString()] || '');
          maxWidth = Math.max(maxWidth, value.length);
        }
        columnWidths[col] = maxWidth;
      });

      // Build header row
      const headerRow = columns.map((col: string) => 
        padString(col, columnWidths[col])
      ).join('  ');
      let result = headerRow + '\n';

      // Build data rows
      for (let i = 0; i < rowCount; i++) {
        const rowValues = columns.map((col: string) => {
          const value = String(data[col][i.toString()] || '');
          return padString(value, columnWidths[col]);
        });
        result += rowValues.join('  ') + '\n';
      }

      return result;
    } catch (e) {
      return resultJson; // Return original if parsing fails
    }
  };

  const handleExecuteQuery = async () => {
    const queries = query.split('\n').filter((q: string) => q.trim() !== '');
    const tables = getSelectedTablesData();
    const resp = await executeQuery(tables, queries);
    const queryStr = queries.join('\n');
    
    // Format and display current result
    const formattedResult = formatResultAsTable(resp.result);
    setCurrentResult(formattedResult);
    
    // Add to local history
    setQueryHistory([...queryHistory, { query: queryStr, result: formattedResult, timestamp: new Date() }]);
    
    replaceResult(resp);
    addToHistory(queryStr, resp);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-100 border-r border-gray-300 p-3 flex flex-col gap-3 overflow-y-auto">
        {/* Import File Dialog */}
        {isImportMode && (
          <div className="flex flex-col gap-2 p-3 bg-blue-50 rounded border border-blue-200">
            <label className="font-semibold text-sm">Import JSON:</label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="text-xs"
            />
            <button
              onClick={() => setIsImportMode(false)}
              className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Table List */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setIsTableDropdownOpen(!isTableDropdownOpen)}
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
                  onClick={() => {
                    const index = selectedTables.indexOf(preset.name);
                    if (index === -1) {
                      setSelectedTables([...selectedTables, preset.name]);
                    } else {
                      setSelectedTables(selectedTables.filter((t: string) => t !== preset.name));
                    }
                  }}
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
          onViewHistory={() => setIsHistoryOpen(true)}
          onCreateTable={() => loadPreset('custom')}
          onEditTable={() => setIsTableOpen(true)}
          onImportTables={() => loadPreset('import')}
          onExportTables={handleExportTables}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Query Input Area - 2/3 of space */}
        <div className="flex-2 p-4 flex flex-col overflow-hidden" style={{flex: '2'}}>
          <label className="font-semibold text-sm mb-2">Query:</label>
          <textarea
            value={query}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuery(e.target.value)}
            placeholder="your query goes here ..."
            className="w-full h-full px-3 py-2 border rounded font-mono text-sm resize-none"
          />
        </div>

        {/* Result Display Area - 1/3 of space */}
        <div className="flex-1 p-4 pt-0 flex flex-col overflow-hidden">
          <label className="font-semibold text-sm mb-2">Result:</label>
          <pre className="w-full h-full px-3 py-2 border rounded bg-gray-50 font-mono text-sm overflow-auto">
            {currentResult || 'Results will appear here after executing a query...'}
          </pre>
        </div>

        {/* Bottom Action Bar */}
        <div className="border-t border-gray-300 p-3 bg-gray-50 flex justify-start">
          <button
            onClick={handleExecuteQuery}
            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-700 font-semibold"
          >
            ▶ execute query
          </button>
        </div>
      </div>

      {/* Modal/Popup */}
      {isTableOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Table Data</h2>
              <button
                onClick={() => setIsTableOpen(false)}
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
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => loadPreset(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  {allTables.map((preset) => (
                    <option key={preset.name} value={preset.name}>
                      {preset.name}
                    </option>
                  ))}
                  <option value="custom">Create a new Table</option>
                </select>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="New column name"
                  className="px-2 py-1 border rounded-md"
                />
                <button
                  onClick={addColumn}
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
                            onClick={() => removeColumn(index)}
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
                              onChange={(e) => updateCell(row.id, col, e.target.value)}
                              className="w-full px-2 py-1 border rounded-md"
                            />
                          </td>
                        ))}
                        <td className="border border-gray-300 p-2">
                          <button
                            onClick={() => removeRow(row.id)}
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
                  onClick={addRow}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                >
                  Add Row
                </button>
                <button
                  onClick={() => setIsTableOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto w-3/4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Query History</h2>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {queryHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No query history yet. Execute a query to see it here!</p>
              ) : (
                queryHistory.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">Query #{queryHistory.length - index}</h3>
                      <span className="text-sm text-gray-500">
                        {item.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-3">
                      <label className="font-semibold text-sm text-gray-700">Query:</label>
                      <pre className="bg-white p-3 rounded border mt-1 text-sm font-mono whitespace-pre-wrap">
                        {item.query}
                      </pre>
                    </div>
                    <div>
                      <label className="font-semibold text-sm text-gray-700">Result:</label>
                      <pre className="bg-white p-3 rounded border mt-1 text-sm font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                        {item.result}
                      </pre>
                    </div>
                    <button
                      onClick={() => {
                        setQuery(item.query);
                        setIsHistoryOpen(false);
                      }}
                      className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Load This Query
                    </button>
                  </div>
                )).reverse()
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setQueryHistory([])}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
              >
                Clear History
              </button>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryBody;
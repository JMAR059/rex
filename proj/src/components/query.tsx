import { useState } from 'react';

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

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-100 border-r border-gray-300 p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm">Select Table:</label>
          <select
            value={selectedPreset}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => loadPreset(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          >
            {allTables.map((preset) => (
              <option key={preset.name} value={preset.name}>
                {preset.name}
              </option>
            ))}
            <option value="custom">Create a new Table</option>
            <option value="import">Import tables</option>
          </select>
        </div>

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
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm mb-1">Tables:</label>
          {allTables.map((preset) => (
            <div key={preset.name} className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                checked={selectedTables.indexOf(preset.name) !== -1}
                onChange={() => toggleTableSelection(preset.name)}
                className="cursor-pointer"
              />
              <span className="text-sm">{preset.name}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={() => setIsTableOpen(true)}
            className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-700"
          >
            Edit Table
          </button>
          <button
            onClick={handleExportTables}
            className="px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-700"
          >
            Export Tables
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Query Input Area */}
        <div className="flex-1 p-4 flex flex-col">
          <textarea
            value={query}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuery(e.target.value)}
            placeholder="your query goes here ..."
            className="flex-1 px-3 py-2 border rounded font-mono text-sm resize-none"
          />
        </div>

        {/* Bottom Action Bar */}
        <div className="border-t border-gray-300 p-4 bg-gray-50 flex justify-start">
          <button
            onClick={() => {
              const queries = query.split('\n').filter((q: string) => q.trim() !== '');
              const tables = getSelectedTablesData();
              handleOnClick(tables, queries, replaceResult, addToHistory);
            }}
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
              <h2 className="text-xl font-bold">Define Table Data</h2>
              <button
                onClick={() => setIsTableOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col gap-4">
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
    </div>
  );
};

export default QueryBody;
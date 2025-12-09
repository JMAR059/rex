import { useState } from 'react';
import ActionButtons from './actionButtons';
import Sidebar from './sidebar';
import TableEditorModal from './tableEditorModal';
import CreateTableModal from './createTableModal';
import HistoryModal from './historyModal';

const apiUrl = "http://localhost:8000/relational_algebra";

interface BodyProps {
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


const Body: React.FC<BodyProps> = ({ replaceResult, addToHistory }) => {
  const studentsPreset = PRESET_TABLES.find((p: PresetTable) => p.name === 'Students');
  const [columns, setColumns] = useState<string[]>(studentsPreset?.columns || ['Column1', 'Column2']);
  const [rows, setRows] = useState<TableRow[]>(studentsPreset?.rows || [{ id: 1 }]);
  const [newColumnName, setNewColumnName] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [isTableOpen, setIsTableOpen] = useState<boolean>(false);
  const [isCreateTableOpen, setIsCreateTableOpen] = useState<boolean>(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('Students');
  const [tableName, setTableName] = useState<string>('Students');
  const [selectedTables, setSelectedTables] = useState<string[]>(['Students']);
  const [importedTables, setImportedTables] = useState<PresetTable[]>([]);
  const [isImportMode, setIsImportMode] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [queryHistory, setQueryHistory] = useState<Array<{query: string, result: string, timestamp: Date}>>([]);
  const [currentResult, setCurrentResult] = useState<string>('');
  const [isTableDropdownOpen, setIsTableDropdownOpen] = useState<boolean>(false);

  const allTables = (() => {
    const tableMap: { [key: string]: PresetTable } = {};
    
    // Add all preset tables first
    PRESET_TABLES.forEach((table: PresetTable) => {
      tableMap[table.name] = table;
    });
    
    // Override with imported tables (if they have the same name)
    importedTables.forEach((table: PresetTable) => {
      tableMap[table.name] = table;
    });
    // Convert map to array
    const result: PresetTable[] = [];
    for (const key in tableMap) {
      if (tableMap.hasOwnProperty(key)) {
        result.push(tableMap[key]);
      }
    }
    return result;
  })();

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
      setSelectedPreset('custom');
      setIsCreateTableOpen(true);
    } else {
      const preset = allTables.find((p: PresetTable) => p.name === presetName);
      if (preset) {
        setColumns(preset.columns);
        setRows(preset.rows);
        setTableName(presetName);
        setSelectedPreset(presetName);
      }
    }
  };

  const handleColumnNameChange = (index: number, newName: string) => {
    if (!newName.trim()) return;
    
    const oldName = columns[index];
    const newColumns = [...columns];
    newColumns[index] = newName;
    setColumns(newColumns);
    
    // Update all row data to use new column name
    const newRows = rows.map(row => {
      const newRow = { ...row };
      if (oldName in newRow) {
        newRow[newName] = newRow[oldName];
        delete newRow[oldName];
      }
      return newRow;
    });
    setRows(newRows);
  };

  const handleTableNameChange = (newName: string) => {
    setTableName(newName);
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

  const saveTableChanges = () => {
    // If we're editing a custom table or a new table, we don't need to update presets
    if (selectedPreset === 'custom') {
      return;
    }

    // For preset tables, update the imported tables array
    const tableIndex = importedTables.findIndex((t: PresetTable) => t.name === selectedPreset);
    
    if (tableIndex !== -1) {
      // Update existing imported table
      const updatedTables = [...importedTables];
      updatedTables[tableIndex] = {
        name: tableName,
        columns: columns,
        rows: rows
      };
      setImportedTables(updatedTables);
    } else {
      // Check if it's a preset table we're modifying
      const isPresetTable = PRESET_TABLES.some((t: PresetTable) => t.name === selectedPreset);
      if (isPresetTable) {
        // Create a modified version in imported tables (don't modify the original preset)
        const modifiedTable: PresetTable = {
          name: tableName,
          columns: columns,
          rows: rows
        };
        setImportedTables([...importedTables, modifiedTable]);
      }
    }
  };

  const handleCloseTableEditor = () => {
    saveTableChanges();
    setIsTableOpen(false);
  };

  const handleCreateTable = () => {
    // Validate table name
    if (!tableName || tableName.trim() === '') {
      alert('Please enter a table name');
      return;
    }

    // Check if table name already exists
    let existingTable = null;
    for (let i = 0; i < allTables.length; i++) {
      if (allTables[i].name === tableName) {
        existingTable = allTables[i];
        break;
      }
    }
    
    if (existingTable && tableName !== 'CustomTable') {
      alert('A table with this name already exists. Please choose a different name.');
      return;
    }

    // Create the new table
    const newTable: PresetTable = {
      name: tableName,
      columns: columns,
      rows: rows
    };

    // Add to imported tables
    setImportedTables([...importedTables, newTable]);
    
    // Add to selected tables so it's ready to use
    if (selectedTables.indexOf(tableName) === -1) {
      setSelectedTables([...selectedTables, tableName]);
    }

    // Close the modal
    setIsCreateTableOpen(false);
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
      <Sidebar
        isImportMode={isImportMode}
        onCancelImport={() => setIsImportMode(false)}
        onFileImport={handleFileImport}
        isTableDropdownOpen={isTableDropdownOpen}
        onToggleDropdown={() => setIsTableDropdownOpen(!isTableDropdownOpen)}
        selectedTables={selectedTables}
        allTables={allTables}
        onTableSelect={(tableName: string) => {
          const index = selectedTables.indexOf(tableName);
          if (index === -1) {
            setSelectedTables([...selectedTables, tableName]);
          } else {
            setSelectedTables(selectedTables.filter((t: string) => t !== tableName));
          }
        }}
        onViewHistory={() => setIsHistoryOpen(true)}
        onCreateTable={() => loadPreset('custom')}
        onEditTable={() => setIsTableOpen(true)}
        onImportTables={() => loadPreset('import')}
        onExportTables={handleExportTables}
      />

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

      {/* Table Editor Modal */}
      <TableEditorModal
        isOpen={isTableOpen}
        onClose={handleCloseTableEditor}
        selectedPreset={selectedPreset}
        allTables={allTables}
        onLoadPreset={loadPreset}
        columns={columns}
        rows={rows}
        tableName={tableName}
        onTableNameChange={handleTableNameChange}
        onColumnNameChange={handleColumnNameChange}
        newColumnName={newColumnName}
        onNewColumnNameChange={setNewColumnName}
        onAddColumn={addColumn}
        onRemoveColumn={removeColumn}
        onUpdateCell={updateCell}
        onRemoveRow={removeRow}
        onAddRow={addRow}
      />

      {/* Create Table Modal */}
      <CreateTableModal
        isOpen={isCreateTableOpen}
        onClose={() => setIsCreateTableOpen(false)}
        columns={columns}
        rows={rows}
        tableName={tableName}
        onTableNameChange={handleTableNameChange}
        onColumnNameChange={handleColumnNameChange}
        newColumnName={newColumnName}
        onNewColumnNameChange={setNewColumnName}
        onAddColumn={addColumn}
        onRemoveColumn={removeColumn}
        onUpdateCell={updateCell}
        onRemoveRow={removeRow}
        onAddRow={addRow}
        onSave={handleCreateTable}
      />

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        queryHistory={queryHistory}
        onLoadQuery={(query: string) => setQuery(query)}
        onClearHistory={() => setQueryHistory([])}
      />
    </div>
  );
};

export default Body;
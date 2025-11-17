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

async function executeQuery(rows: TableRow[], columns: string[]): Promise<{result: string}> {
  // Transform data to {column1: [values...], column2: [values...]}
  const columnData: Record<string, (string | number)[]> = {};
  
  columns.forEach(col => {
    columnData[col] = rows.map(row => row[col] || '');
  });
  console.log("Sending data to API:", columnData);
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({"relation": columnData}),
  });
  const data = await response.json();
  return {"result": data.result};
}

const handleOnClick = async (
  rows: TableRow[], 
  columns: string[], 
  replaceResult: QueryProps['replaceResult'], 
  addToHistory: QueryProps['addToHistory']
) => {
  const resp = await executeQuery(rows, columns);
  const query = JSON.stringify({ columns, rows });
  replaceResult(resp);
  addToHistory(query, resp);
};

const QueryBody: React.FC<QueryProps> = ({ replaceResult, addToHistory }) => {
  const [columns, setColumns] = useState<string[]>(['Column1', 'Column2']);
  const [rows, setRows] = useState<TableRow[]>([{ id: 1 }]);
  const [newColumnName, setNewColumnName] = useState<string>('');

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
          onClick={() => handleOnClick(rows, columns, replaceResult, addToHistory)}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default QueryBody;
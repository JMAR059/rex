interface QueryHistoryItem {
  query: string;
  result: string;
  timestamp: Date;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  queryHistory: QueryHistoryItem[];
  onLoadQuery: (query: string) => void;
  onClearHistory: () => void;
}

export default function HistoryModal({
  isOpen,
  onClose,
  queryHistory,
  onLoadQuery,
  onClearHistory,
}: HistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto w-3/4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Query History</h2>
          <button
            onClick={onClose}
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
                    onLoadQuery(item.query);
                    onClose();
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
            onClick={onClearHistory}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
          >
            Clear History
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';

interface HistoryBodyProps {
  lastQuery: string;
  result: string;
  replaceResult: (resp:{result: string}) => void;
}

const HistoryBody: React.FC<HistoryBodyProps> = ({ lastQuery, result, replaceResult}) => {
  const [history, setHistory] = useState<string[]>([]);
  const [historyMap, setHistoryMap] = useState<{[index:string]: any}>({});

    const appendToMap = (key: string, val: any) => {
    setHistoryMap(prev => ({
        ...prev,
        [key]: val
    }));
    };
  // Add lastQuery to history when it changes
  // also add to the history map to check it
  useEffect(() => {
    if (lastQuery.trim() !== '') {
      setHistory(prev => [lastQuery, ...prev]);
      appendToMap(lastQuery, result);
    }
  }, [lastQuery]);

  const handleOnClick = (query:string) =>{
    const associatedResult = historyMap[query];
    replaceResult({result:associatedResult});
  };

  return (
    <div>
      <h3 className="font-bold mb-2">Query History</h3>
      <ul className="list-disc pl-4">
        {history.length === 0 ? (
          <li className="text-gray-500">No queries yet.</li>
        ) : (
          history.map((query, index) => (
            <li key={index} className="mb-1 text-sm">
              <button onClick={() => handleOnClick(query)}>
                {query}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default HistoryBody;

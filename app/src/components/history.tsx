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
    <div className="h-full min-w-0 border-[3px] border-[#3A2814] bg-[#C4A76B] p-3 font-['Space_Mono',monospace] text-[#3A2814] shadow-[4px_4px_0_#666347]">
      <h3 className="mb-3 border-b-[3px] border-[#3A2814] bg-[#7A4A23] px-3 py-2 font-['VT323',monospace] text-2xl uppercase tracking-wider text-[#FFFDB1]">
        Query History
      </h3>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {history.length === 0 ? (
          <li className="border-[2px] border-dashed border-[#774D2E] bg-[#FBF4D4] px-3 py-2 text-sm text-[#774D2E]">
            No queries yet.
          </li>
        ) : (
          history.map((query, index) => (
            <li key={index} className="text-sm">
              <button
                type="button"
                onClick={() => handleOnClick(query)}
                title="Load this query result"
                className="w-full border-[2px] border-[#3A2814] bg-[#FFFDB1] px-3 py-2 text-left text-[#3A2814] shadow-[2px_2px_0_#774D2E] transition-colors hover:bg-[#EA851A] focus-visible:outline focus-visible:outline-dashed focus-visible:outline-offset-2 focus-visible:outline-[#3A2814]"
              >
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

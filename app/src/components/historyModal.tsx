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

const buttonBase =
  "font-['Space_Mono',monospace] font-bold uppercase tracking-wider border-[3px] border-[#3A2814] " +
  'rounded-none shadow-[4px_4px_0_#3A2814] cursor-pointer transition-[transform,box-shadow,background-color] duration-75 ' +
  'hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_#3A2814] ' +
  'active:translate-x-1 active:translate-y-1 active:shadow-none ' +
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-dashed focus-visible:outline-offset-[3px] focus-visible:outline-[#3A2814]';

export default function HistoryModal({
  isOpen,
  onClose,
  queryHistory,
  onLoadQuery,
  onClearHistory,
}: HistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#3A2814]/80 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-[#C4A76B] text-[#3A2814] font-['Space_Mono',monospace] border-[5px] border-[#3A2814] shadow-[8px_8px_0_#3A2814] p-5 sm:p-7 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5 bg-[#7A4A23] text-[#FFFDB1] border-[3px] border-[#3A2814] px-4 py-2">
          <h2 className="font-['VT323',monospace] text-4xl uppercase tracking-wider">Query History</h2>
          <button
            onClick={onClose}
            aria-label="Close query history"
            className={`${buttonBase} bg-[#FFFDB1] text-[#3A2814] px-2 text-2xl leading-none hover:bg-[#EA851A]`}
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {queryHistory.length === 0 ? (
            <p className="border-[3px] border-dashed border-[#774D2E] bg-[#FBF4D4] text-center py-8 text-[#774D2E]">
              No query history yet. Execute a query to see it here!
            </p>
          ) : (
            queryHistory.map((item, index) => (
              <div key={index} className="border-[3px] border-[#3A2814] p-4 bg-[#F4E8B0] shadow-[4px_4px_0_#774D2E]">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg uppercase tracking-wider">Query #{queryHistory.length - index}</h3>
                  <span className="text-sm text-[#774D2E]">
                    {item.timestamp.toLocaleString()}
                  </span>
                </div>
                <div className="mb-3">
                  <label className="font-bold text-sm uppercase tracking-wider">Query:</label>
                  <pre className="bg-[#FBF4D4] text-[#3A2814] p-3 border-[2px] border-[#3A2814] mt-1 text-sm font-mono whitespace-pre-wrap">
                    {item.query}
                  </pre>
                </div>
                <div>
                  <label className="font-bold text-sm uppercase tracking-wider">Result:</label>
                  <pre className="bg-[#FBF4D4] text-[#3A2814] p-3 border-[2px] border-[#3A2814] mt-1 text-sm font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {item.result}
                  </pre>
                </div>
                <button
                  onClick={() => {
                    onLoadQuery(item.query);
                    onClose();
                  }}
                  className={`mt-3 px-4 py-2 bg-[#70CAA2] text-[#3A2814] text-sm ${buttonBase}`}
                >
                  Load This Query
                </button>
              </div>
            )).reverse()
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClearHistory}
            className={`px-4 py-2 bg-[#FF3100] text-[#FFFDB1] ${buttonBase}`}
          >
            Clear History
          </button>
          <button
            onClick={onClose}
            className={`px-4 py-2 bg-[#7A4A23] text-[#FFFDB1] ${buttonBase}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

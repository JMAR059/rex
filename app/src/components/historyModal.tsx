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
  "font-body font-bold uppercase tracking-wider border-[length:var(--border-w)] border-ink " +
  'rounded-theme shadow-hard cursor-pointer transition-[transform,box-shadow,background-color] duration-75 ' +
  'hover:-translate-x-px hover:-translate-y-px hover:shadow-[calc(var(--shadow-offset)*1.25)_calc(var(--shadow-offset)*1.25)_0_var(--color-ink)] ' +
  'active:translate-x-1 active:translate-y-1 active:shadow-none ' +
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-dashed focus-visible:outline-offset-[3px] focus-visible:outline-ink';

export default function HistoryModal({
  isOpen,
  onClose,
  queryHistory,
  onLoadQuery,
  onClearHistory,
}: HistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-overlay/80 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-panel text-ink font-body border-[length:var(--border-heavy)] border-ink rounded-theme shadow-[calc(var(--shadow-offset)*2)_calc(var(--shadow-offset)*2)_0_var(--color-ink)] p-5 sm:p-7 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5 bg-header text-header-fg border-[length:var(--border-w)] border-ink px-4 py-2">
          <h2 className="font-display text-4xl uppercase tracking-wider">Query History</h2>
          <button
            onClick={onClose}
            aria-label="Close query history"
            className={`${buttonBase} bg-paper text-ink px-2 text-2xl leading-none hover:bg-button-accent hover:text-accent-fg`}
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {queryHistory.length === 0 ? (
            <p className="border-[length:var(--border-w)] border-dashed border-muted bg-surface text-center py-8 text-muted">
              No query history yet. Execute a query to see it here!
            </p>
          ) : (
            queryHistory.map((item, index) => (
              <div key={index} className="border-[length:var(--border-w)] border-ink p-4 bg-sand shadow-[var(--shadow-offset)_var(--shadow-offset)_0_var(--color-muted)]">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg uppercase tracking-wider">Query #{queryHistory.length - index}</h3>
                  <span className="text-sm text-muted">
                    {item.timestamp.toLocaleString()}
                  </span>
                </div>
                <div className="mb-3">
                  <label className="font-bold text-sm uppercase tracking-wider">Query:</label>
                  <pre className="bg-surface text-ink p-3 border-[length:var(--border-thin)] border-ink mt-1 text-sm font-mono whitespace-pre-wrap">
                    {item.query}
                  </pre>
                </div>
                <div>
                  <label className="font-bold text-sm uppercase tracking-wider">Result:</label>
                  <pre className="bg-surface text-ink p-3 border-[length:var(--border-thin)] border-ink mt-1 text-sm font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {item.result}
                  </pre>
                </div>
                <button
                  onClick={() => {
                    onLoadQuery(item.query);
                    onClose();
                  }}
                  className={`mt-3 px-4 py-2 bg-button-success text-button-success-fg text-sm ${buttonBase}`}
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
            className={`px-4 py-2 bg-button-danger text-button-danger-fg ${buttonBase}`}
          >
            Clear History
          </button>
          <button
            onClick={onClose}
            className={`px-4 py-2 bg-header text-header-fg ${buttonBase}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

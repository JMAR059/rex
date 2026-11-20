import ActionButtons from './actionButtons';
import { useRef, useState } from 'react';

interface TableRow {
  id: number;
  [key: string]: string | number;
}

interface PresetTable {
  name: string;
  columns: string[];
  rows: TableRow[];
}

interface SidebarProps {
  isImportMode: boolean;
  onCancelImport: () => void;
  onFileImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isTableDropdownOpen: boolean;
  onToggleDropdown: () => void;
  selectedTables: string[];
  allTables: PresetTable[];
  deletableTables: string[];
  onTableSelect: (tableName: string) => void;
  onDeleteTable: (tableName: string) => void;
  onCreateTable: () => void;
  onEditTable: () => void;
  onImportTables: () => void;
  onExportTables: () => void;
}

const btn =
  "font-body font-bold uppercase tracking-wider text-sidebar-ink bg-paper-alt " +
  'border-[length:var(--border-w)] border-sidebar-ink rounded-theme shadow-[var(--shadow-offset)_var(--shadow-offset)_0_var(--color-muted)] cursor-pointer ' +
  'hover:-translate-x-px hover:-translate-y-px hover:shadow-[calc(var(--shadow-offset)*1.25)_calc(var(--shadow-offset)*1.25)_0_var(--color-muted)] ' +
  'active:translate-x-1 active:translate-y-1 active:shadow-none transition-[transform,box-shadow] duration-75 ' +
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-dashed focus-visible:outline-offset-[3px] focus-visible:outline-sidebar-ink';

const label = "font-body font-bold text-[13px] uppercase tracking-wider";

// Restyles every <button> rendered inside <ActionButtons /> without editing that component.
const actionButtonStyles = '';

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

export default function Sidebar({
  isImportMode,
  onCancelImport,
  onFileImport,
  isTableDropdownOpen,
  onToggleDropdown,
  selectedTables,
  allTables,
  deletableTables,
  onTableSelect,
  onDeleteTable,
  onCreateTable,
  onEditTable,
  onImportTables,
  onExportTables,
}: SidebarProps) {
  const importFileInput = useRef<HTMLInputElement>(null);
  const [importFileName, setImportFileName] = useState('');
  const handleImportTables = () => {
    onImportTables();
    importFileInput.current?.click();
  };

  console.log(allTables);
  return (
    <div className="w-72 shrink-0 bg-panel border-r-[length:var(--border-heavy)] border-sidebar-ink text-sidebar-ink font-body flex flex-col min-h-0">

            <div className="flex-1 min-h-0 overflow-y-auto p-5 flex flex-col gap-5">
      <input
        ref={importFileInput}
        type="file"
        accept=".json"
        onChange={onFileImport}
        className="hidden"
      />

      {/* Import File Dialog */}
      {isImportMode && (
        <div className="flex flex-col gap-3 p-3 bg-paper-alt border-[length:var(--border-w)] border-sidebar-ink shadow-[var(--shadow-offset)_var(--shadow-offset)_0_var(--color-muted)]">
          <label className={label}>Import JSON:</label>
          <input
            type="file"
            accept=".json"
            onChange={(e) => {
              setImportFileName(e.target.files?.[0]?.name ?? '');
              onFileImport(e);
            }}
            className="sr-only"
            id="sidebar-import-file"
          />
          <div className="flex items-center gap-2 text-xs">
            <label
              htmlFor="sidebar-import-file"
              className="shrink-0 px-2 py-1 border-[length:var(--border-thin)] border-sidebar-ink bg-muted text-paper-alt font-bold cursor-pointer"
            >
              Choose File
            </label>
            <span className="truncate">{importFileName || 'None chosen'}</span>
          </div>
          <button onClick={onCancelImport} className={`${btn} min-h-10 px-3 py-1 text-xs`}>
            Cancel
          </button>
        </div>
      )}

      {/* Table List */}
      <div className="flex flex-col gap-2">
        <span className={label}>Tables</span>
        <button
          onClick={onToggleDropdown}
          className={`${btn} !bg-field w-full min-h-12 px-3 py-2 text-sm text-left normal-case tracking-normal flex justify-between items-center`}
        >
          <span>
            Select Tables ({selectedTables.length > 0 ? selectedTables.join(', ') : 'None'})
          </span>
          <span>{isTableDropdownOpen ? '▲' : '▼'}</span>
        </button>

        {isTableDropdownOpen && (
          <div className="border-[length:var(--border-w)] border-sidebar-ink bg-paper-alt shadow-[var(--shadow-offset)_var(--shadow-offset)_0_var(--color-muted)] max-h-60 overflow-y-auto">
            {allTables.sort((a: PresetTable, b: PresetTable) => a.name.localeCompare(b.name)).map((preset) => (
              <div
                key={preset.name}
                onClick={() => onTableSelect(preset.name)}
                className="px-3 py-2 hover:bg-muted hover:text-paper-alt cursor-pointer flex items-center gap-2 text-sm border-b-[length:var(--border-thin)] border-dashed border-muted/40 last:border-b-0"
              >
                <input
                  type="checkbox"
                  checked={selectedTables.indexOf(preset.name) !== -1}
                  readOnly
                  className="cursor-pointer accent-muted"
                />
                <span className="min-w-0 flex-1 truncate">{preset.name}</span>
                {deletableTables.includes(preset.name) && (
                  <button
                    type="button"
                    aria-label={`Delete custom table ${preset.name}`}
                    title="Delete custom table"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDeleteTable(preset.name);
                    }}
                    className="shrink-0 border-[length:var(--border-thin)] border-sidebar-ink bg-button-danger px-2 py-1 text-[10px] font-bold uppercase text-button-danger-fg hover:bg-header hover:text-header-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sidebar-ink"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Tables Schema Display */}
      {selectedTables.length > 0 && (
        <div className="flex flex-col gap-3 pt-5 border-t-[length:var(--border-w)] border-dashed border-muted">
          <span className={label}>Schema:</span>
          {selectedTables.sort().map((tableName) => {
            const table = allTables.find((t: PresetTable) => t.name === tableName);
            if (!table) return null;
            return (
              <div key={tableName} className="flex flex-col gap-2">
                <div className="font-display text-2xl leading-none">{tableName}</div>
                <div className="flex flex-col gap-2 bg-field border-[length:var(--border-w)] border-sidebar-ink rounded-theme px-3.5 py-3 text-sm">
                  {table.columns.map((col) => (
                    <div key={col} className="flex justify-between gap-3">
                      <span>{col}</span>
                      <span className="italic text-muted">{getColumnType(col, table)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      </div>

      {/* Action Buttons (existing component, restyled via the wrapper) */}
      <div className={`${actionButtonStyles} shrink-0 p-5 pt-3 border-t-[length:var(--border-w)] border-dashed border-muted`}>
        <div className="mb-3 text-md font-bold text-sidebar-ink">Table actions</div>
        <ActionButtons
          onCreateTable={onCreateTable}
          onEditTable={onEditTable}
          onImportTables={handleImportTables}
          onExportTables={onExportTables}
        />
      </div>
    </div>
  );
}
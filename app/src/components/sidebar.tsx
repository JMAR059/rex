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
  onTableSelect: (tableName: string) => void;
  onViewHistory: () => void;
  onEditTable: () => void;
  onImportTables: () => void;
  onExportTables: () => void;
}

/*
  Light brown retro theme (Tailwind arbitrary values)
    ink    #3A2A1A   dark brown: text + borders
    brown  #774D2E   hard shadows, hover fills
    sand   #F4E8B0   sidebar background (light brown / khaki)
    paper  #FDFBB5   fields + buttons (pale yellow)
*/
const btn =
  "font-['Space_Mono',monospace] font-bold uppercase tracking-wider text-[#3A2A1A] bg-[#FDFBB5] " +
  'border-[3px] border-[#3A2A1A] rounded-none shadow-[4px_4px_0_#774D2E] cursor-pointer ' +
  'hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_#774D2E] ' +
  'active:translate-x-1 active:translate-y-1 active:shadow-none transition-[transform,box-shadow] duration-75 ' +
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-dashed focus-visible:outline-offset-[3px] focus-visible:outline-[#3A2A1A]';

const label = "font-['Space_Mono',monospace] font-bold text-[13px] uppercase tracking-wider";

// Restyles every <button> rendered inside <ActionButtons /> without editing that component.
const actionButtonStyles =
  '[&>*]:gap-3.5 ' +
  '[&_button]:w-full [&_button]:min-h-12 [&_button]:px-5 [&_button]:py-2 [&_button]:rounded-none ' +
  '[&_button]:border-[3px] [&_button]:border-[#3A2A1A] [&_button]:bg-[#FDFBB5] [&_button]:text-[#3A2A1A] ' +
  "[&_button]:font-['Space_Mono',monospace] [&_button]:font-bold [&_button]:text-[15px] " +
  '[&_button]:uppercase [&_button]:tracking-wider [&_button]:shadow-[4px_4px_0_#774D2E] [&_button]:cursor-pointer ' +
  '[&_button]:transition-[transform,box-shadow] [&_button]:duration-75 ' +
  '[&_button]:hover:bg-[#FDFBB5] [&_button]:hover:-translate-x-px [&_button]:hover:-translate-y-px [&_button]:hover:shadow-[5px_5px_0_#774D2E] ' +
  '[&_button]:active:translate-x-1 [&_button]:active:translate-y-1 [&_button]:active:shadow-none';

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
  onTableSelect,
  onViewHistory,
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
    <div className="w-72 shrink-0 bg-[#C4A76B] border-r-[5px] border-[#3A2A1A] text-[#3A2A1A] font-['Space_Mono',monospace] flex flex-col min-h-0">
      {/* Loads Space Mono + VT323 so no other file needs to change */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=VT323&display=swap');`}</style>

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
        <div className="flex flex-col gap-3 p-3 bg-[#FDFBB5] border-[3px] border-[#3A2A1A] shadow-[4px_4px_0_#774D2E]">
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
              className="shrink-0 px-2 py-1 border-2 border-[#3A2A1A] bg-[#774D2E] text-[#FDFBB5] font-bold cursor-pointer"
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
          className={`${btn} !bg-white w-full min-h-12 px-3 py-2 text-sm text-left normal-case tracking-normal flex justify-between items-center`}
        >
          <span>
            Select Tables ({selectedTables.length > 0 ? selectedTables.join(', ') : 'None'})
          </span>
          <span>{isTableDropdownOpen ? '▲' : '▼'}</span>
        </button>

        {isTableDropdownOpen && (
          <div className="border-[3px] border-[#3A2A1A] bg-[#FDFBB5] shadow-[4px_4px_0_#774D2E] max-h-60 overflow-y-auto">
            {allTables.sort((a: PresetTable, b: PresetTable) => a.name.localeCompare(b.name)).map((preset) => (
              <div
                key={preset.name}
                onClick={() => onTableSelect(preset.name)}
                className="px-3 py-2 hover:bg-[#774D2E] hover:text-[#FDFBB5] cursor-pointer flex items-center gap-2 text-sm border-b-2 border-dashed border-[#774D2E]/40 last:border-b-0"
              >
                <input
                  type="checkbox"
                  checked={selectedTables.indexOf(preset.name) !== -1}
                  readOnly
                  className="cursor-pointer accent-[#774D2E]"
                />
                <span>{preset.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Tables Schema Display */}
      {selectedTables.length > 0 && (
        <div className="flex flex-col gap-3 pt-5 border-t-[3px] border-dashed border-[#774D2E]">
          <span className={label}>Schema:</span>
          {selectedTables.sort().map((tableName) => {
            const table = allTables.find((t: PresetTable) => t.name === tableName);
            if (!table) return null;
            return (
              <div key={tableName} className="flex flex-col gap-2">
                <div className="font-['VT323',monospace] text-2xl leading-none">{tableName}</div>
                <div className="flex flex-col gap-2 bg-white border-[3px] border-[#3A2A1A] px-3.5 py-3 text-sm">
                  {table.columns.map((col) => (
                    <div key={col} className="flex justify-between gap-3">
                      <span>{col}</span>
                      <span className="italic text-[#774D2E]">{getColumnType(col, table)}</span>
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
      <div className={`${actionButtonStyles} shrink-0 p-5 pt-3 border-t-[3px] border-dashed border-[#774D2E]`}>
        <ActionButtons
          onViewHistory={onViewHistory}
          onEditTable={onEditTable}
          onImportTables={handleImportTables}
          onExportTables={onExportTables}
          onCreateTable={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      </div>
    </div>
  );
}
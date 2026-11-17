import ActionButtons from './actionButtons';
import ThemeToggle from './ThemeToggle';
import { sidebarStyles } from './sidebarStyles';
import { useThemeMode } from '../theme/useThemeMode';
import { useRef } from 'react';

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
  onEditTable: () => void;
  onImportTables: () => void;
  onExportTables: () => void;
}

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
  onEditTable,
  onImportTables,
  onExportTables,
}: SidebarProps) {
  // All colors, borders and shadows come from sidebarStyles.ts, picked by the current mode.
  const { mode } = useThemeMode();
  const s = sidebarStyles[mode];

  const importFileInput = useRef<HTMLInputElement>(null);
  const handleImportTables = () => {
    onImportTables();
    importFileInput.current?.click();
  };

  console.log(allTables);
  return (
    <div className={s.root}>
      {/* Loads Space Mono + VT323 so no other file needs to change */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=VT323&display=swap');`}</style>

      <div className={s.scrollArea}>
        {/* Switches the whole page between retro and plain mode */}
        <ThemeToggle />

        <input
          ref={importFileInput}
          type="file"
          accept=".json"
          onChange={onFileImport}
          className="hidden"
        />

        {/* Import File Dialog */}
        {isImportMode && (
          <div className={s.importBox}>
            <label className={s.label}>Import JSON:</label>
            <input
              type="file"
              accept=".json"
              onChange={onFileImport}
              className={s.importFileInput}
            />
            <button onClick={onCancelImport} className={s.button}>
              Cancel
            </button>
          </div>
        )}

        {/* Table List */}
        <div className="flex flex-col gap-2">
          <span className={s.label}>Tables</span>
          <button onClick={onToggleDropdown} className={s.selectButton}>
            <span>
              Select Tables ({selectedTables.length > 0 ? selectedTables.join(', ') : 'None'})
            </span>
            <span>{isTableDropdownOpen ? '▲' : '▼'}</span>
          </button>

          {isTableDropdownOpen && (
            <div className={s.dropdown}>
              {allTables.sort((a: PresetTable, b: PresetTable) => a.name.localeCompare(b.name)).map((preset) => (
                <div
                  key={preset.name}
                  onClick={() => onTableSelect(preset.name)}
                  className={s.dropdownItem}
                >
                  <input
                    type="checkbox"
                    checked={selectedTables.indexOf(preset.name) !== -1}
                    readOnly
                    className={s.dropdownCheckbox}
                  />
                  <span>{preset.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Tables Schema Display */}
        {selectedTables.length > 0 && (
          <div className={s.schemaSection}>
            <span className={s.label}>Schema:</span>
            {selectedTables.sort().map((tableName) => {
              const table = allTables.find((t: PresetTable) => t.name === tableName);
              if (!table) return null;
              return (
                <div key={tableName} className="flex flex-col gap-2">
                  <div className={s.schemaName}>{tableName}</div>
                  <div className={s.schemaBox}>
                    {table.columns.map((col) => (
                      <div key={col} className="flex justify-between gap-3">
                        <span>{col}</span>
                        <span className={s.schemaType}>{getColumnType(col, table)}</span>
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
<<<<<<< HEAD
      <div className={`${actionButtonStyles} shrink-0 p-5 pt-3 border-t-[3px] border-dashed border-[#774D2E]`}>
        <div className="mb-3 text-md font-bold text-[#3A2A1A]">Table actions</div>
=======
      <div className={s.actionsWrapper}>
>>>>>>> c4d0aaf (Add retro/plain theme toggle for the sidebar)
        <ActionButtons
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
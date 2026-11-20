import type { ThemeMode } from '../theme/useThemeMode';

/*
  All sidebar styling lives here, one object per mode, so the retro theme and the plain
  theme can be edited independently without touching the sidebar's layout or logic.
  Both objects must have the same keys (TypeScript enforces this).
*/
export interface SidebarStyles {
  root: string;
  scrollArea: string;
  label: string;
  button: string;
  selectButton: string;
  dropdown: string;
  dropdownItem: string;
  dropdownCheckbox: string;
  deleteButton: string;
  schemaSection: string;
  schemaName: string;
  schemaBox: string;
  schemaType: string;
  importBox: string;
  importFileInput: string;
  fileLabel: string;
  actionsWrapper: string;
}

/* ---------- Retro mode: light brown retro theme ----------
    ink    #3A2A1A   dark brown: text + borders
    brown  #774D2E   hard shadows, action button fill
    dark   #5A3A22   action button hover
    sand   #C4A76B   sidebar background
    paper  #FDFBB5   fields
    cream  #FFF1D6   action button text
*/
const retroBtn =
  "font-['Space_Mono',monospace] font-bold uppercase tracking-wider text-[#3A2A1A] bg-[#FDFBB5] " +
  'border-[3px] border-[#3A2A1A] rounded-none shadow-[4px_4px_0_#774D2E] cursor-pointer ' +
  'hover:-translate-x-px hover:-translate-y-px hover:shadow-[5px_5px_0_#774D2E] ' +
  'active:translate-x-1 active:translate-y-1 active:shadow-none transition-[transform,box-shadow] duration-75 ' +
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-dashed focus-visible:outline-offset-[3px] focus-visible:outline-[#3A2A1A]';

// Restyles every <button> rendered inside <ActionButtons /> without editing that component.
// The "!" forces these over the component's own per-button colors and shadow.
const retroActionButtons =
  '[&_button]:!shadow-[4px_4px_0_#774D2E] ' +
  '[&_button]:!bg-[#774D2E] [&_button]:!text-[#FFF1D6] ' +
  '[&_button]:hover:!bg-[#5A3A22] [&_button]:hover:!text-[#FFF1D6]';

const retro: SidebarStyles = {
  root: "w-72 shrink-0 bg-[#C4A76B] border-r-[5px] border-[#3A2A1A] text-[#3A2A1A] font-['Space_Mono',monospace] flex flex-col min-h-0",
  scrollArea: 'flex-1 min-h-0 overflow-y-auto p-5 flex flex-col gap-5 [&>*]:shrink-0',
  label: "font-['Space_Mono',monospace] font-bold text-[13px] uppercase tracking-wider",
  button: `${retroBtn} min-h-10 px-3 py-1 text-xs`,
  selectButton: `${retroBtn} !bg-white w-full min-h-12 px-3 py-2 text-sm text-left normal-case tracking-normal flex justify-between items-center`,
  dropdown:
    'border-[3px] border-[#3A2A1A] bg-[#FDFBB5] shadow-[4px_4px_0_#774D2E] max-h-60 overflow-y-auto',
  dropdownItem:
    'px-3 py-2 hover:bg-[#774D2E] hover:text-[#FDFBB5] cursor-pointer flex items-center gap-2 text-sm border-b-2 border-dashed border-[#774D2E]/40 last:border-b-0',
  dropdownCheckbox: 'cursor-pointer accent-[#774D2E]',
  deleteButton:
    'shrink-0 border-2 border-[#3A2A1A] bg-[#FF3100] px-2 py-1 text-[10px] font-bold uppercase text-[#FDFBB5] hover:bg-[#7A4A23] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3A2A1A]',
  schemaSection: 'flex flex-col gap-3 pt-5 border-t-[3px] border-dashed border-[#774D2E]',
  schemaName: "font-['VT323',monospace] text-2xl leading-none",
  schemaBox:
    'flex flex-col gap-2 bg-white border-[3px] border-[#3A2A1A] px-3.5 py-3 text-sm',
  schemaType: 'italic text-[#774D2E]',
  importBox:
    'flex flex-col gap-3 p-3 bg-[#FDFBB5] border-[3px] border-[#3A2A1A] shadow-[4px_4px_0_#774D2E]',
  importFileInput:
    'text-xs file:mr-2 file:px-2 file:py-1 file:border-2 file:border-[#3A2A1A] file:bg-[#774D2E] file:text-[#FDFBB5] file:font-bold file:cursor-pointer',
  fileLabel:
    'shrink-0 px-2 py-1 border-2 border-[#3A2A1A] bg-[#774D2E] text-[#FDFBB5] font-bold cursor-pointer',
  actionsWrapper: `${retroActionButtons} shrink-0 p-5 pt-3 border-t-[3px] border-dashed border-[#774D2E]`,
};

/* ---------- Plain mode: simple, neutral, low-stimulation ----------
   Light gray background, thin borders, no shadows, no uppercase, system sans-serif font.
*/
const plainActionButtons =
  '[&_button]:!bg-white [&_button]:!text-gray-800 ' +
  '[&_button]:!border [&_button]:!border-gray-300 [&_button]:!rounded-md [&_button]:!shadow-none ' +
  '[&_button]:!font-sans [&_button]:!font-medium [&_button]:!normal-case [&_button]:!tracking-normal ' +
  '[&_button]:hover:!bg-gray-100';

const plain: SidebarStyles = {
  root: 'w-72 shrink-0 bg-gray-50 border-r border-gray-200 text-gray-800 font-sans flex flex-col min-h-0',
  scrollArea: 'flex-1 min-h-0 overflow-y-auto p-5 flex flex-col gap-5 [&>*]:shrink-0',
  label: 'text-xs font-medium text-gray-500',
  button:
    'w-full min-h-10 px-3 py-1 text-xs rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 cursor-pointer transition-colors',
  selectButton:
    'w-full min-h-11 px-3 py-2 text-sm text-left rounded-md border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 cursor-pointer transition-colors flex justify-between items-center',
  dropdown: 'rounded-md border border-gray-200 bg-white max-h-60 overflow-y-auto',
  dropdownItem:
    'px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-sm border-b border-gray-100 last:border-b-0',
  dropdownCheckbox: 'cursor-pointer accent-gray-700',
  deleteButton:
    'shrink-0 rounded border border-red-300 bg-white px-2 py-1 text-[10px] font-medium text-red-600 hover:bg-red-50 cursor-pointer',
  schemaSection: 'flex flex-col gap-3 pt-5 border-t border-gray-200',
  schemaName: 'text-base font-medium',
  schemaBox: 'flex flex-col gap-2 bg-white rounded-md border border-gray-200 px-3.5 py-3 text-sm',
  schemaType: 'text-gray-500',
  importBox: 'flex flex-col gap-3 p-3 bg-white rounded-md border border-gray-200',
  importFileInput:
    'text-xs text-gray-700 file:mr-2 file:px-2 file:py-1 file:rounded file:border file:border-gray-300 file:bg-white file:text-gray-800 file:cursor-pointer',
  fileLabel:
    'shrink-0 px-2 py-1 rounded border border-gray-300 bg-white text-gray-800 text-xs cursor-pointer hover:bg-gray-100',
  actionsWrapper: `${plainActionButtons} shrink-0 p-5 pt-3 border-t border-gray-200`,
};

export const sidebarStyles: Record<ThemeMode, SidebarStyles> = { retro, plain };
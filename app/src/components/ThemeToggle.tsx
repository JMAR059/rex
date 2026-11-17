import { useThemeMode, type ThemeMode } from '../theme/useThemeMode';

const options: { value: ThemeMode; label: string }[] = [
  { value: 'retro', label: 'Retro' },
  { value: 'plain', label: 'Plain' },
];

// The toggle restyles itself for each mode so it looks at home in both.
const styles: Record<ThemeMode, { group: string; active: string; inactive: string }> = {
  retro: {
    group:
      "flex shrink-0 border-[3px] border-[#3A2A1A] shadow-[4px_4px_0_#774D2E] font-['Space_Mono',monospace] font-bold text-xs uppercase tracking-wider",
    active: 'flex-1 px-3 py-2 bg-[#774D2E] text-[#FFF1D6] cursor-pointer',
    inactive: 'flex-1 px-3 py-2 bg-white text-[#3A2A1A] hover:bg-[#FDFBB5] cursor-pointer',
  },
  plain: {
    group: 'flex shrink-0 rounded-md border border-gray-300 overflow-hidden text-xs font-medium',
    active: 'flex-1 px-3 py-2 bg-gray-800 text-white cursor-pointer',
    inactive: 'flex-1 px-3 py-2 bg-white text-gray-700 hover:bg-gray-100 cursor-pointer',
  },
};

export default function ThemeToggle() {
  const { mode, setMode } = useThemeMode();
  const s = styles[mode];

  return (
    <div role="group" aria-label="Page theme" className={s.group}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={mode === option.value}
          onClick={() => setMode(option.value)}
          className={mode === option.value ? s.active : s.inactive}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
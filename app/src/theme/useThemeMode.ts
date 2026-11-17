import { useSyncExternalStore } from 'react';

export type ThemeMode = 'retro' | 'plain';

const STORAGE_KEY = 'rex-theme-mode';
const DEFAULT_MODE: ThemeMode = 'retro';

const listeners = new Set<() => void>();

function readSavedMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'retro' || saved === 'plain') return saved;
  } catch {
    // localStorage can be unavailable (private mode, blocked storage). Fall through to the default.
  }
  return DEFAULT_MODE;
}

let currentMode: ThemeMode = readSavedMode();

// Also exposed on <html data-theme="..."> so any other component or CSS can react to the mode.
document.documentElement.dataset.theme = currentMode;

export function setThemeMode(mode: ThemeMode): void {
  if (mode === currentMode) return;
  currentMode = mode;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Not being able to save the choice is fine; it just won't persist across reloads.
  }
  document.documentElement.dataset.theme = mode;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ThemeMode {
  return currentMode;
}

/**
 * Shared theme mode for the whole page. Works anywhere in the app with no provider:
 *   const { mode, setMode, toggleMode } = useThemeMode();
 */
export function useThemeMode() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    mode,
    setMode: setThemeMode,
    toggleMode: () => setThemeMode(currentMode === 'retro' ? 'plain' : 'retro'),
  };
}
import { useSyncExternalStore } from 'react';

export type ThemeMode = 'retro' | 'plain';

const KEY = 'rexThemeMode';
const listeners = new Set<() => void>();

function read(): ThemeMode {
  try {
    return localStorage.getItem(KEY) === 'plain' ? 'plain' : 'retro';
  } catch {
    return 'retro';
  }
}

let current: ThemeMode = read();
document.documentElement.setAttribute('data-theme', current);

function setMode(mode: ThemeMode) {
  current = mode;
  try {
    localStorage.setItem(KEY, mode);
  } catch {
    /* ignore storage errors */
  }
  document.documentElement.setAttribute('data-theme', mode);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useThemeMode() {
  const mode = useSyncExternalStore(subscribe, () => current);
  return { mode, setMode };
}

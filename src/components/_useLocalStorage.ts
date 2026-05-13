import { useState, useEffect, useRef } from 'react';

/**
 * A useState-compatible hook that persists to localStorage.
 * Safe against SSR/private mode (catches quota errors).
 */
export function useLocalStorage<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return initial;
      return JSON.parse(raw) as T;
    } catch { return initial; }
  });

  const keyRef = useRef(key);
  useEffect(() => { keyRef.current = key; }, [key]);

  useEffect(() => {
    try { localStorage.setItem(keyRef.current, JSON.stringify(value)); } catch {}
  }, [value]);

  return [value, setValue];
}

/** Same as above but for Set<string> (serialised as array). */
export function useLocalStorageSet(key: string, initial: Iterable<string> = []): [Set<string>, React.Dispatch<React.SetStateAction<Set<string>>>] {
  const [value, setValue] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set(initial);
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return new Set(initial);
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set([...initial, ...arr]);
      return new Set(initial);
    } catch { return new Set(initial); }
  });

  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify([...value])); } catch {}
  }, [key, value]);

  return [value, setValue];
}

import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  function changeTheme(value) {
    setTheme(value);
    try { localStorage.setItem('presence-theme', value); } catch { /* Storage may be unavailable. */ }
  }
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => {
      try { if (localStorage.getItem('presence-theme')) return; } catch { /* Use the system preference. */ }
      setTheme(media.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', sync);
    const storage = event => {
      if (event.key === 'presence-theme') setTheme(event.newValue === 'dark' ? 'dark' : event.newValue === 'light' ? 'light' : media.matches ? 'dark' : 'light');
    };
    window.addEventListener('storage', storage);
    return () => { media.removeEventListener('change', sync); window.removeEventListener('storage', storage); };
  }, []);
  return { theme, setTheme: changeTheme, toggleTheme: () => changeTheme(theme === 'dark' ? 'light' : 'dark') };
}

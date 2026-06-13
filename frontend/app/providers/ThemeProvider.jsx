import { useEffect } from 'react';

export default function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.classList.add('light');
  }, []);

  return children;
}

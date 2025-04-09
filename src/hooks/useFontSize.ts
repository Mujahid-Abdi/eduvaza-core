import { useEffect, useState } from 'react';

export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

const FONT_SIZE_KEY = 'afedulight-font-size';

export const useFontSize = () => {
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    const saved = localStorage.getItem(FONT_SIZE_KEY);
    return (saved as FontSize) || 'medium';
  });

  useEffect(() => {
    // Apply font size class to html element
    const html = document.documentElement;
    html.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');
    html.classList.add(`font-${fontSize}`);
  }, [fontSize]);

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem(FONT_SIZE_KEY, size);
  };

  return { fontSize, setFontSize };
};

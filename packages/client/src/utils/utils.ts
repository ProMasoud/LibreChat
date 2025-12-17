// ESM utility functions
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

/**
 * RTL character ranges for Arabic and Persian scripts
 * Arabic: \u0600-\u06FF (Arabic)
 * Arabic Supplement: \u0750-\u077F
 * Arabic Extended-A: \u08A0-\u08FF
 * Arabic Presentation Forms-A: \uFB50-\uFDFF
 * Arabic Presentation Forms-B: \uFE70-\uFEFF
 * Persian/Farsi specific characters are within the Arabic range
 */
const RTL_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

/**
 * Detects if text should be displayed in RTL direction based on the first word
 * @param text - The text to analyze
 * @returns 'rtl' if the first word contains RTL characters, 'ltr' otherwise
 */
export const detectTextDirection = (text: string): 'rtl' | 'ltr' => {
  if (!text || text.trim().length === 0) {
    return 'ltr';
  }

  // Get the first word (non-whitespace characters at the start)
  const firstWord = text.trimStart().split(/\s+/)[0];

  if (!firstWord) {
    return 'ltr';
  }

  // Check if the first word contains RTL characters
  return RTL_REGEX.test(firstWord) ? 'rtl' : 'ltr';
};

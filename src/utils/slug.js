/**
 * Converts a title string to a URL-friendly slug.
 * Handles Arabic characters by transliterating them to Latin equivalents.
 *
 * @param {string} title - The text to slugify
 * @returns {string} A lowercase, hyphen-separated slug
 */
const arabicToLatin = {
  'أ': 'a', 'ا': 'a', 'إ': 'a', 'آ': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th',
  'ج': 'g', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
  'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
  'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
  'ه': 'h', 'و': 'w', 'ي': 'y', 'ة': 't', 'ى': 'a', 'ئ': 'a', 'ؤ': 'w',
  ' ': '-',
};

export const toSlug = (title) => {
  if (!title) return '';
  return title
    .trim()
    .toLowerCase()
    .split('')
    .map(ch => arabicToLatin[ch] || ch)
    .join('')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};
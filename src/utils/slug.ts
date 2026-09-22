/**
 * Converts a title string to a URL-friendly slug.
 * Handles Arabic characters by transliterating them to Latin equivalents.
 *
 * @param {string} [title] - The text to slugify
 * @returns {string} A lowercase, hyphen-separated slug
 */
const arabicToLatin: Record<string, string> = {
  'أ': 'a', 'ا': 'a', 'إ': 'a', 'آ': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th',
  'ج': 'g', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z',
  'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
  'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
  'ه': 'h', 'و': 'w', 'ي': 'y', 'ة': 't', 'ى': 'a', 'ئ': 'a', 'ؤ': 'w',
  ' ': '-',
};

export const toSlug = (title?: string | null): string => {
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

/**
 * Resolves the canonical URL slug for a project: a curated `slug` when set,
 * otherwise the title-derived slug. Keeps all links/canonical/sitemap routes
 * in sync in a single place.
 */
export const projectSlug = (project: { slug?: string | null; title?: string | null }): string =>
  (project.slug && project.slug.trim()) ? project.slug.trim() : toSlug(project.title);

export const isValidSlug = (slug: string): boolean => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
// Locale registry for the site's /locales/<code>/ tree. Source of truth
// for the codes themselves is spec/locales-for-global-sharing-with-svelte
// /locales.tsv — keep the two in sync if a locale is added or removed.
//
// Labels are endonyms (each language's own name for itself), except the
// four English variants, which need a qualifier to tell them apart in a
// picker that lists all four side by side.

export const DEFAULT_LOCALE = 'en-001';

export const LOCALE_LABELS: Record<string, string> = {
  'ar-001': 'العربية',
  'bn-001': 'বাংলা',
  'cy-001': 'Cymraeg',
  'en-001': 'English',
  'en-gb': 'English (UK)',
  'en-gb-oxendict': 'English (UK, Oxford spelling)',
  'en-us': 'English (US)',
  'es-001': 'Español',
  'fr-001': 'Français',
  'hi-001': 'हिन्दी',
  'id-001': 'Bahasa Indonesia',
  'pt-001': 'Português',
  'ru-001': 'Русский',
  'ur-001': 'اردو',
  'zh-cn': '中文'
};

/** Resolve a locale code to its display label, falling back to the raw code. */
export function localeLabel(locale: string): string {
  return LOCALE_LABELS[locale] ?? locale;
}

/**
 * Every supported locale code, sorted. The "-001" (world/generic) suffix
 * sorts before any letter-starting regional suffix ('0' < any letter in
 * ASCII), so e.g. en-001 already comes before en-gb/en-gb-oxendict/en-us
 * without a special case — this is also PickerBar's header order.
 */
export function locales(): string[] {
  return Object.keys(LOCALE_LABELS).sort();
}

// Locales whose script reads right-to-left. LocalePicker's own applyDir
// already handles this via its bundled RTL_LANGUAGE_TAGS list, kept here
// too since the localized layout needs it for the same reason (choosing
// which side a "Skip to main content" link, etc. visually anchors to).
const RTL_LOCALES = new Set(['ar-001', 'ur-001']);

export function isRtl(locale: string): boolean {
  return RTL_LOCALES.has(locale);
}

/**
 * Reduce a locale code to the tag the HTML `lang` attribute should carry.
 * The "-001" suffix is a UN M49 "World" region code, not a real BCP 47
 * region subtag, so it's dropped (es-001 -> es); en-gb-oxendict has no
 * standard subtag for "Oxford spelling" either, so it maps to the same
 * tag as en-gb — still accurate (Oxford spelling is British English),
 * just not distinguishable from plain en-GB by user agents.
 */
export function bcp47Tag(locale: string): string {
  if (locale.endsWith('-001')) return locale.slice(0, -4);
  if (locale === 'en-gb-oxendict') return 'en-GB';
  const [lang, region] = locale.split('-');
  return region ? `${lang}-${region.toUpperCase()}` : lang;
}

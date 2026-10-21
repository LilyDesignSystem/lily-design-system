// Locale registry for the site's /<code>/ tree. Source of truth
// for the codes themselves is spec/locales-for-global-sharing-with-svelte
// /locales.tsv — keep the two in sync if a locale is added or removed.
//
// Labels are endonyms (each language's own name for itself), except the
// four English variants, which need a qualifier to tell them apart in a
// picker that lists all four side by side. The qualifier is the full
// region name after a dash ("English - Great Britain"), never an
// abbreviation or a parenthetical.

export const DEFAULT_LOCALE = 'en-001';

export const LOCALE_LABELS: Record<string, string> = {
  'ar-001': 'العربية',
  'bg-001': 'Български',
  'bg-bg': 'Български - България',
  'bh-001': 'भोजपुरी',
  'bn-001': 'বাংলা',
  'cs-001': 'Čeština',
  'cs-cz': 'Čeština - Česko',
  'cy-001': 'Cymraeg',
  'cy-gb': 'Cymraeg - Prydain Fawr',
  'da-001': 'Dansk',
  'da-dk': 'Dansk - Danmark',
  'de-001': 'Deutsch',
  'de-at': 'Deutsch - Österreich',
  'de-de': 'Deutsch - Deutschland',
  'el-001': 'Ελληνικά',
  'el-cy': 'Ελληνικά - Κύπρος',
  'el-gr': 'Ελληνικά - Ελλάδα',
  'en-001': 'English',
  'en-gb': 'English - Great Britain',
  'en-gb-oxendict': 'English - Great Britain - Oxford',
  'en-us': 'English - United States',
  'es-001': 'Español',
  'es-es': 'Español - España',
  'et-001': 'Eesti keel',
  'et-ee': 'Eesti keel - Eesti',
  'eu-001': 'Euskara',
  'eu-es': 'Euskara - Espainia',
  'fa-001': 'فارسی',
  'fi-001': 'Suomi',
  'fi-fi': 'Suomi - Suomi',
  'fr-001': 'Français',
  'fr-be': 'Français - Belgique',
  'fr-fr': 'Français - France',
  'ga-001': 'Gaeilge',
  'ga-ie': 'Gaeilge - Éire',
  'gd-001': 'Gàidhlig',
  'gd-gb': 'Gàidhlig - Breatainn Mhòr',
  'gu-001': 'ગુજરાતી',
  'ha-001': 'Harshen Hausa',
  'he-001': 'עברית',
  'hi-001': 'हिन्दी',
  'hi-in': 'हिन्दी - भारत',
  'hr-001': 'Hrvatski',
  'hr-hr': 'Hrvatski - Hrvatska',
  'hu-001': 'Magyar',
  'hu-hu': 'Magyar - Magyarország',
  'id-001': 'Bahasa Indonesia',
  'id-id': 'Bahasa Indonesia - Indonesia',
  'is-001': 'Íslenska',
  'is-is': 'Íslenska - Ísland',
  'it-001': 'Italiano',
  'it-it': 'Italiano - Italia',
  'ja-001': '日本語',
  'ja-jp': '日本語 - 日本',
  'jv-001': 'Basa Jawa',
  'km-001': 'ខ្មែរ',
  'km-kh': 'ខ្មែរ - កម្ពុជា',
  'kn-001': 'ಕನ್ನಡ',
  'ko-001': '한국어',
  'ko-kr': '한국어 - 대한민국',
  'kw-001': 'Kernewek',
  'kw-gb': 'Kernewek - Breten Veur',
  'lb-001': 'Lëtzebuergesch',
  'lb-lu': 'Lëtzebuergesch - Lëtzebuerg',
  'lo-001': 'ລາວ',
  'lo-la': 'ລາວ - ລາວ',
  'lt-001': 'Lietuvių',
  'lt-lt': 'Lietuvių - Lietuva',
  'lv-001': 'Latviešu',
  'lv-lv': 'Latviešu - Latvija',
  'mr-001': 'मराठी',
  'ms-001': 'Bahasa Melayu',
  'mt-001': 'Malti',
  'mt-mt': 'Malti - Malta',
  'nb-001': 'Norsk bokmål',
  'nb-no': 'Norsk bokmål - Norge',
  'nl-001': 'Nederlands',
  'nl-nl': 'Nederlands - Nederland',
  'pa-001': 'ਪੰਜਾਬੀ',
  'pcm-001': 'Naijá',
  'pl-001': 'Polski',
  'pl-pl': 'Polski - Polska',
  'pt-001': 'Português',
  'pt-pt': 'Português - Portugal',
  'ro-001': 'Română',
  'ro-ro': 'Română - România',
  'ru-001': 'Русский',
  'sco-gb': 'Scots - Great Britain',
  'sk-001': 'Slovenčina',
  'sk-sk': 'Slovenčina - Slovensko',
  'sl-001': 'Slovenščina',
  'sl-si': 'Slovenščina - Slovenija',
  'sv-001': 'Svenska',
  'sv-se': 'Svenska - Sverige',
  'sw-001': 'Kiswahili',
  'sw-tz': 'Kiswahili - Tanzania',
  'ta-001': 'தமிழ்',
  'te-001': 'తెలుగు',
  'th-001': 'ไทย',
  'th-th': 'ไทย - ประเทศไทย',
  'tl-001': 'Tagalog',
  'tr-001': 'Türkçe',
  'tr-tr': 'Türkçe - Türkiye',
  'uk-001': 'Українська',
  'ur-001': 'اردو',
  'vi-001': 'Tiếng Việt',
  'vi-vn': 'Tiếng Việt - Việt Nam',
  'wuu-001': '吴语',
  'yue-001': '粵語',
  'zh-001': '中文',
  'zh-cn': '中文 - 中国'
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
const RTL_LOCALES = new Set(['ar-001', 'fa-001', 'he-001', 'ur-001']);

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

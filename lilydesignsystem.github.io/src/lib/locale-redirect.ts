// Pick the /locales/<code>/ route that best matches the browser's language preferences, for the
// home page's first-visit redirect. Pure so it can be tested without a browser.
//
// Matching, per preferred language in order (navigator.languages, else navigator.language):
//   1. the tag itself          cy-GB  -> cy-gb   (underscores accepted: cy_GB)
//   2. language + region       zh-Hans-CN -> zh-cn
//   3. the language's generic  fr-CA  -> fr-001
// The first preference that matches wins; the "-001" route is the language's international
// locale, so en-AU (no en-au route) goes to en-001. Nothing else is guessed: zh-TW has no route
// here and no zh-001, so it does not fall back to zh-CN, and stays on "/".

export function pickLocaleRoute(preferred: readonly string[], available: readonly string[]): string | null {
  const have = new Set(available);
  for (const raw of preferred) {
    const parts = raw
      .trim()
      .toLowerCase()
      .replace(/_/g, '-')
      .split('-')
      .filter(Boolean);
    if (!parts.length) continue;
    const lang = parts[0];
    const region = parts.slice(1).find((p) => /^[a-z]{2}$/.test(p) || /^\d{3}$/.test(p));
    const candidates = [parts.join('-'), region ? `${lang}-${region}` : '', `${lang}-001`];
    for (const c of candidates) {
      if (c && have.has(c)) return c;
    }
  }
  return null;
}

const SESSION_KEY = 'lily-locale-redirect-done';

/**
 * True the first time it is called in a browser session, false afterwards (and false if session
 * storage is unavailable). The redirect happens at most once per session so that a visitor who
 * deliberately comes back to "/" — to read the English page — is not sent away again.
 */
export function firstVisitThisSession(): boolean {
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return false;
    sessionStorage.setItem(SESSION_KEY, '1');
    return true;
  } catch {
    return false;
  }
}

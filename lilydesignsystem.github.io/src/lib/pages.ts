// Translated text pages for the /<code>/<page>/ tree.
//
// The English source of each page is src/routes/<slug>/+page.svelte; bin/extract-site-pages turns it into
// src/lib/pages/<slug>/en.html, and each language adds <slug>/<language>.html with the same markup
// structure (bin/check-site-page-translations enforces that). The locale code's language part picks the
// file: cy-001 and cy-gb both use cy.html; en-* use the English routes and never come through here.
//
// Each file starts with `<!-- title: … -->` and `<!-- description: … -->` comments, then the page body.

const raw = import.meta.glob('/src/lib/pages/*/*.html', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

/** The pages that have translations, in the order the generator and checker walk them. */
export const PAGE_SLUGS = [
  'about',
  'why',
  'accessibility',
  'help',
  'comparisons',
  'tutorials',
  'examples',
  'skills'
] as const;

export type PageSlug = (typeof PAGE_SLUGS)[number];

export type TranslatedPage = { title: string; description: string; html: string };

/** The language a locale code uses for its page files: `cy-gb` -> `cy`, `zh-cn` -> `zh`. */
export function pageLanguage(locale: string): string {
  return locale.split('-')[0];
}

/** Does this locale have translated pages? English locales use the English routes. */
export function hasTranslatedPages(locale: string): boolean {
  const lang = pageLanguage(locale);
  return lang !== 'en' && PAGE_SLUGS.every((s) => `/src/lib/pages/${s}/${lang}.html` in raw);
}

function parse(source: string): TranslatedPage {
  const title = /<!--\s*title:\s*([\s\S]*?)\s*-->/.exec(source)?.[1] ?? '';
  const description = /<!--\s*description:\s*([\s\S]*?)\s*-->/.exec(source)?.[1] ?? '';
  const html = source.replace(/^(\s*<!--[\s\S]*?-->)+/, '').trim();
  return { title, description: description || title, html };
}

/** The translated page, or null when this locale has none for the slug. */
export function pageFor(slug: PageSlug, locale: string): TranslatedPage | null {
  const source = raw[`/src/lib/pages/${slug}/${pageLanguage(locale)}.html`];
  return source === undefined ? null : parse(source);
}

/**
 * Point the page's internal links at the same locale's translated pages, so a reader who started in
 * Welsh stays in Welsh: href="/about/" becomes href="/cy-gb/about/". Links to pages that
 * have no translation (components, the tutorials per framework, …) are left alone.
 */
export function localizeLinks(html: string, locale: string): string {
  const slugs = PAGE_SLUGS.join('|');
  return html.replace(
    new RegExp(`href="/(${slugs})/"`, 'g'),
    (_, slug) => `href="/${locale}/${slug}/"`
  );
}

/** The href for a page in a locale: the translated page when there is one, else the English page. */
export function pageHref(slug: PageSlug, locale: string): string {
  return hasTranslatedPages(locale) ? `/${locale}/${slug}/` : `/${slug}/`;
}

import type { Handle } from '@sveltejs/kit';
import { LOCALE_LABELS, bcp47Tag, isRtl } from '$lib/locales';

// Sets <html lang dir> per route at prerender time (adapter-static still
// runs this hook once per discovered page during the build), so a direct
// visit to e.g. /locales/ar-001/ renders with the correct language and
// text direction from the very first byte — no client-side flash of the
// wrong direction while LocalePicker's own runtime dir-switching catches
// up. Non-locale routes keep the app.html default (lang="en").
const LOCALE_PATH = /^\/locales\/([a-z0-9-]+)\//;

export const handle: Handle = async ({ event, resolve }) => {
  const match = LOCALE_PATH.exec(event.url.pathname);
  const code = match && match[1] in LOCALE_LABELS ? match[1] : null;
  if (!code) return resolve(event);

  const lang = bcp47Tag(code);
  const dir = isRtl(code) ? 'rtl' : 'ltr';
  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('<html lang="en">', `<html lang="${lang}" dir="${dir}">`)
  });
};

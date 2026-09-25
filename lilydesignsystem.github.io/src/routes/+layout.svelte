<script lang="ts">
  import { page } from '$app/state';
  import SitePreferences from '$lib/components/SitePreferences.svelte';
  import { ui } from '$lib/i18n';
  import { DEFAULT_LOCALE, LOCALE_LABELS, bcp47Tag, isRtl } from '$lib/locales';

  let { children } = $props();

  // Every route outside /locales/<code>/ is the site's canonical,
  // untranslated content and behaves exactly as before (DEFAULT_LOCALE's
  // strings match that hardcoded English verbatim — see src/lib/i18n.ts).
  // See spec/locales-for-global-sharing-with-svelte for the rollout this
  // is part of.
  const LOCALE_PATH = /^\/locales\/([a-z0-9-]+)\//;

  const currentLocale = $derived.by(() => {
    const match = LOCALE_PATH.exec(page.url.pathname);
    return match && match[1] in LOCALE_LABELS ? match[1] : DEFAULT_LOCALE;
  });

  const strings = $derived(ui(currentLocale));

  const homeHref = $derived(currentLocale === DEFAULT_LOCALE ? '/' : `/locales/${currentLocale}/`);

  type NavLink = { href: string; label: string };
  const navLinks = $derived<NavLink[]>([
    { href: homeHref, label: strings.nav.home },
    { href: '/components/', label: strings.nav.components },
    { href: '/tutorials/', label: strings.nav.tutorials },
    { href: '/examples/', label: strings.nav.examples },
    { href: '/skills/', label: strings.nav.skills },
    { href: '/help/', label: strings.nav.help },
    { href: '/about/', label: strings.nav.about }
  ]);

  function isCurrent(href: string): boolean {
    return page.url.pathname === href;
  }

  // hooks.server.ts sets <html lang dir> correctly for the initial
  // prerendered/SSR response; this keeps them correct across SvelteKit's
  // client-side navigation too (a nav click doesn't re-run the server
  // hook), and LocalePicker's own onChange handles the case where the
  // user switches locale without a full navigation.
  $effect(() => {
    document.documentElement.lang = bcp47Tag(currentLocale);
    document.documentElement.dir = isRtl(currentLocale) ? 'rtl' : 'ltr';
  });
</script>

<a class="skip-link" href="#main">{strings.skipLink}</a>

<header class="site-header">
  <div class="site-header-inner">
    <a class="site-brand" href={homeHref} aria-label={strings.brandAriaLabel}>
      <img
        class="site-brand-mark"
        src="/assets/images/lily-design-system-icon/lily-design-system-icon.svg"
        alt=""
        aria-hidden="true"
      />
      <span class="site-brand-name">Lily Design System™</span>
    </a>
    <nav class="site-nav" aria-label="Main">
      {#each navLinks as link}
        <a href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>
          {link.label}
        </a>
      {/each}
      <a href="https://github.com/LilyDesignSystem">{strings.nav.github}</a>
    </nav>
    <SitePreferences locale={currentLocale} />
  </div>
</header>

<main id="main" class="site-main">
  {@render children()}
</main>

<footer class="site-footer">
  <div class="site-footer-inner">
    <p>{strings.footer.license}</p>
    <p class="site-footer-trademark">{strings.footer.trademark}</p>
    <div class="site-footer-links">
      <a href="https://github.com/LilyDesignSystem">{strings.nav.github}</a>
      <a href="/why/">{strings.footer.why}</a>
      <a href="/tutorials/">{strings.nav.tutorials}</a>
      <a href="/help/">{strings.nav.help}</a>
      <a href="/about/">{strings.nav.about}</a>
      <a href="/locales/">{strings.pickerLabels.locale}</a>
    </div>
  </div>
</footer>

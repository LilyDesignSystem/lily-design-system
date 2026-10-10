<!--
  LocaleHome — the translated home page shown at /<code>/. One
  shared template so all 15 locales render identical structure; only the
  strings (src/lib/i18n.ts) and the locale code differ per page.

  This is intentionally a small subset of the canonical English home
  page's content (src/routes/+page.svelte), not a full translation of
  it — see spec/locales-for-global-sharing-with-svelte's "starts empty"
  rollout note. `home.notice` says so, in the page's own language.
-->
<script lang="ts">
  import { LILY_COMPONENTS } from '#lib/components.js';
  import { ui } from '#lib/i18n.js';
  import { localeLabel } from '#lib/locales.js';
  import { pageHref } from '#lib/pages.js';

  let { locale }: { locale: string } = $props();

  const strings = $derived(ui(locale));
</script>

<svelte:head>
  <title>Lily Design System&trade; — {localeLabel(locale)}</title>
</svelte:head>

<section class="page-intro">
  <h1>{strings.home.heroTitle}</h1>
  <p class="page-intro-tagline">{strings.home.heroTagline}</p>
  <ul class="framework-icon-row" aria-label={strings.home.frameworks}>
    <li>
      <a class="framework-icon-link" href="/tutorials/svelte/">
        <img src="/assets/images/icons/svelte/64x64.png" alt="" width="40" height="40" />
        <span>Svelte</span>
      </a>
    </li>
    <li>
      <a class="framework-icon-link" href="/tutorials/react/">
        <img src="/assets/images/icons/react/64x64.png" alt="" width="40" height="40" />
        <span>React</span>
      </a>
    </li>
    <li>
      <a class="framework-icon-link" href="/tutorials/vue/">
        <img src="/assets/images/icons/vue/64x64.png" alt="" width="40" height="40" />
        <span>Vue</span>
      </a>
    </li>
    <li>
      <a class="framework-icon-link" href="/tutorials/angular/">
        <img src="/assets/images/icons/angular/64x64.png" alt="" width="40" height="40" />
        <span>Angular</span>
      </a>
    </li>
    <li>
      <a class="framework-icon-link" href="/tutorials/blazor/">
        <img src="/assets/images/icons/blazor/64x64.png" alt="" width="40" height="40" />
        <span>Blazor</span>
      </a>
    </li>
    <li>
      <a class="framework-icon-link" href="/tutorials/nunjucks/">
        <img src="/assets/images/icons/nunjucks/64x64.png" alt="" width="40" height="40" />
        <span>Nunjucks</span>
      </a>
    </li>
    <li>
      <a class="framework-icon-link" href="/tutorials/html/">
        <img src="/assets/images/icons/html/64x64.png" alt="" width="40" height="40" />
        <span>HTML</span>
      </a>
    </li>
    <li>
      <a class="framework-icon-link" href="https://github.com/LilyDesignSystem/lily-design-system/tree/main/lily-design-system-web-components-headless">
        <img src="/assets/images/icons/web-components/64x64.png" alt="" width="40" height="40" />
        <span>Web Components</span>
      </a>
    </li>
  </ul>
</section>

<section class="section prose" style="margin: 0 auto;">
  <div class="callout">
    <p style="margin: 0;">{strings.home.notice}</p>
  </div>
</section>

<section class="section">
  <header class="section-heading">
    <h2>{strings.home.findPath}</h2>
  </header>

  <div class="card-grid">
    <a class="card" href={pageHref('tutorials', locale)}>
      <h3 class="card-heading">{strings.home.tutorials.heading}</h3>
      <p class="card-description">{strings.home.tutorials.description}</p>
    </a>
    <a class="card" href="/components/">
      <h3 class="card-heading">{strings.home.components.heading}</h3>
      <p class="card-description">{strings.home.components.description}</p>
      <p class="card-meta">{LILY_COMPONENTS.length}</p>
    </a>
    <a class="card" href={pageHref('examples', locale)}>
      <h3 class="card-heading">{strings.home.examples.heading}</h3>
      <p class="card-description">{strings.home.examples.description}</p>
    </a>
  </div>
</section>

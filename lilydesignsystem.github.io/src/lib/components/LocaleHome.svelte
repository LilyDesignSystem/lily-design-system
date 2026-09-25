<!--
  LocaleHome — the translated home page shown at /locales/<code>/. One
  shared template so all 15 locales render identical structure; only the
  strings (src/lib/i18n.ts) and the locale code differ per page.

  This is intentionally a small subset of the canonical English home
  page's content (src/routes/+page.svelte), not a full translation of
  it — see spec/locales-for-global-sharing-with-svelte's "starts empty"
  rollout note. `home.notice` says so, in the page's own language.
-->
<script lang="ts">
  import { LILY_COMPONENTS } from '$lib/components';
  import { ui } from '$lib/i18n';
  import { localeLabel } from '$lib/locales';

  let { locale }: { locale: string } = $props();

  const strings = $derived(ui(locale));
</script>

<svelte:head>
  <title>Lily Design System&trade; — {localeLabel(locale)}</title>
</svelte:head>

<section class="page-intro">
  <h1>{strings.home.heroTitle}</h1>
  <p class="page-intro-tagline">{strings.home.heroTagline}</p>
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
    <a class="card" href="/tutorials/">
      <h3 class="card-heading">{strings.home.tutorials.heading}</h3>
      <p class="card-description">{strings.home.tutorials.description}</p>
    </a>
    <a class="card" href="/components/">
      <h3 class="card-heading">{strings.home.components.heading}</h3>
      <p class="card-description">{strings.home.components.description}</p>
      <p class="card-meta">{LILY_COMPONENTS.length}</p>
    </a>
    <a class="card" href="/examples/">
      <h3 class="card-heading">{strings.home.examples.heading}</h3>
      <p class="card-description">{strings.home.examples.description}</p>
    </a>
  </div>
</section>

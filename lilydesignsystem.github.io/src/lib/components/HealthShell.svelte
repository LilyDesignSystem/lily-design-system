<!--
  HealthShell — the frame shared by the health-care example pages under /en-001/examples/: skip link, a header with the
  examples navigation and the picker bar, a main landmark and a footer note. A page supplies its content as the children.

  Every control on these pages is a Lily component or native element styled by the selected theme; the page CSS below
  is layout only, written with theme tokens. The people, places and numbers are invented and nothing here is clinical
  advice. The brand slot holds plain text: an adopter's own mark would go there.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import PickerBar from '@lilydesignsystem/svelte-picker-bar';
  import { THEMES, THEME_LABELS } from '#lib/themes.js';

  let {
    pageTitle,
    current,
    children
  }: { pageTitle: string; current: string; children: Snippet } = $props();

  const pages = [
    { slug: 'health-care-dental-access', label: 'Dental access' },
    { slug: 'health-care-test-requests', label: 'Test requests' },
    { slug: 'health-care-pharmacies', label: 'Pharmacies' },
    { slug: 'health-care-prescriptions', label: 'Prescriptions' },
    { slug: 'health-care-continuous-patient-monitoring', label: 'Patient monitoring' },
    { slug: 'health-care-shared-medicines', label: 'Shared medicines' }
  ];
</script>

<svelte:head>
  <title>{pageTitle} — Lily Design System™ example</title>
</svelte:head>

<a class="skip-link" href="#hc-main">Skip to main content</a>

<div class="hc">
  <header class="hc-bar">
    <p class="hc-brand">Example Health Service</p>
    <nav class="hc-nav" aria-label="Health-care examples">
      <ul>
        {#each pages as p (p.slug)}
          <li>
            <a href={`/en-001/examples/${p.slug}/`} aria-current={current === p.slug ? 'page' : undefined}>{p.label}</a>
          </li>
        {/each}
      </ul>
    </nav>
    <PickerBar
      class="hc-pickers"
      labels={{ theme: 'Theme', locale: 'Language', textSize: 'Text size', share: 'Share' }}
      themesUrl="/assets/themes/"
      themes={THEMES}
      themeProps={{ value: 'corporate', storageKey: 'lily-health-theme', themeLabels: THEME_LABELS }}
      locales={['en-gb']}
      localeProps={{ localeLabels: { 'en-gb': 'English' }, storageKey: 'lily-health-locale' }}
      textSizeProps={{ storageKey: 'lily-health-text-size' }}
    />
  </header>

  <main id="hc-main" class="hc-main">
    {@render children()}
    <p class="hc-note">
      An example page: every person, place and number is invented, and nothing here is clinical advice.
      <a href="/examples/">All examples</a>
    </p>
  </main>
</div>

<style>
  .hc {
    min-block-size: 100dvh;
    background: var(--color-base-200, Canvas);
    color: var(--color-base-content, CanvasText);
  }
  .hc-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 1.5rem;
    padding: 0.5rem 1rem;
    background: var(--color-primary);
    color: var(--color-primary-content);
  }
  .hc-bar :global(a) {
    color: inherit;
  }
  .hc-brand {
    margin: 0;
    font-weight: 700;
    font-size: 1.125rem;
  }
  .hc-nav ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .hc-nav a {
    padding-block: 0.25rem;
  }
  .hc-nav a[aria-current='page'] {
    font-weight: 700;
    text-decoration: none;
    border-block-end: 3px solid currentColor;
  }
  .hc-bar :global(.hc-pickers) {
    margin-inline-start: auto;
  }
  .hc-main {
    max-inline-size: 72rem;
    margin-inline: auto;
    padding: 1rem;
    min-inline-size: 0;
  }
  .hc-main :global(h1) {
    margin-block: 0.25rem 0.5rem;
    color: var(--color-primary);
  }
  .hc-main :global(.hc-card) {
    background: var(--color-base-100, Canvas);
    border: 1px solid var(--color-base-300, currentColor);
    border-inline-start: 4px solid var(--hc-tone, var(--color-primary));
    border-radius: var(--lily-radius-md, 0.5rem);
    padding: 0.75rem 1rem;
    min-inline-size: 0;
  }
  .hc-main :global(.hc-card h2),
  .hc-main :global(.hc-card h3) {
    margin-block: 0 0.5rem;
  }
  .hc-main :global(.hc-grid) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
    gap: 0.75rem;
    margin-block-end: 0.75rem;
  }
  .hc-main :global(.hc-vh) {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .hc-main :global(.hc-scroll) {
    position: relative;
    overflow-x: auto;
  }
  .hc-main :global(.hc-field) {
    display: grid;
    gap: 0.25rem;
    margin-block-end: 0.75rem;
  }
  .hc-main :global(.hc-status) {
    margin-block: 0.5rem;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-base-300, currentColor);
    border-inline-start: 4px solid var(--color-info);
    background: var(--color-base-100, Canvas);
  }
  .hc-main :global(.hc-pill) {
    display: inline-block;
    padding: 0.0625rem 0.625rem;
    border-radius: 999px;
    font-size: 0.8125rem;
    font-weight: 600;
    background: color-mix(in oklab, var(--hc-tone, var(--color-primary)) 20%, var(--color-base-100, Canvas));
    border: 1px solid var(--hc-tone, var(--color-primary));
  }
  .hc-main :global([data-state='good']) {
    --hc-tone: var(--color-success);
  }
  .hc-main :global([data-state='warn']) {
    --hc-tone: var(--color-warning);
  }
  .hc-main :global([data-state='bad']) {
    --hc-tone: var(--color-error);
  }
  .hc-main :global([data-state='neutral']) {
    --hc-tone: var(--color-neutral);
  }
  .hc-note {
    margin-block: 1.5rem 0;
    font-size: 0.75rem;
  }
</style>

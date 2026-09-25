<script lang="ts">
  import { DEFAULT_LOCALE, locales, localeLabel } from '$lib/locales';

  // Default locale first, then grouped by language name (the label text
  // before a trailing "(" — e.g. every English variant groups together),
  // then alphabetically by label within a group. Plain string comparison
  // does not sort meaningfully across scripts (Arabic vs Bengali vs
  // Cyrillic, say) — this only needs to be deterministic, not a real
  // collation, since each group has exactly one member in every script
  // except English. See spec/locales-for-global-sharing-with-svelte.
  function groupLabel(code: string): string {
    return localeLabel(code).split(' (')[0];
  }

  const orderedLocales = locales().sort((a, b) => {
    if (a === DEFAULT_LOCALE) return -1;
    if (b === DEFAULT_LOCALE) return 1;
    const ga = groupLabel(a);
    const gb = groupLabel(b);
    if (ga !== gb) return ga < gb ? -1 : 1;
    const la = localeLabel(a);
    const lb = localeLabel(b);
    return la < lb ? -1 : la > lb ? 1 : 0;
  });
</script>

<svelte:head>
  <title>Lily Design System&trade; — Languages</title>
</svelte:head>

<section class="page-intro">
  <h1>Choose a language</h1>
  <p class="page-intro-tagline">
    The home page is translated into every language below. Deeper pages
    (tutorials, component docs) are still English-only for now — see
    each translated home page for a note in its own language.
  </p>
</section>

<section class="section">
  <ul class="component-list component-list-stacked" aria-label="Languages">
    {#each orderedLocales as code (code)}
      <li class="component-list-item">
        <a class="component-list-item-link" href="/locales/{code}/">
          <span class="component-list-item-name">{localeLabel(code)}</span>
        </a>
      </li>
    {/each}
  </ul>
</section>

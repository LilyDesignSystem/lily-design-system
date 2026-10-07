<!--
  LocalizedPage — a translated text page at /locales/<code>/<slug>/.

  The markup comes from src/lib/pages/<slug>/<language>.html (see src/lib/pages.ts); it is our own
  static content, so it is rendered with {@html}. Code samples (<pre>) are made keyboard-focusable the
  same way the English pages do (axe: scrollable-region-focusable), and internal links are pointed at
  the locale's own translated pages.
-->
<script lang="ts">
  import { localizeLinks, pageFor, type PageSlug } from '#lib/pages.js';

  let { slug, locale }: { slug: PageSlug; locale: string } = $props();

  const page = $derived(pageFor(slug, locale));
  const html = $derived(
    page ? localizeLinks(page.html, locale).replace(/<pre(?![^>]*tabindex)/g, '<pre tabindex="0"') : ''
  );
</script>

<svelte:head>
  {#if page}
    <title>{page.title}</title>
    <meta name="description" content={page.description} />
  {/if}
</svelte:head>

{@html html}

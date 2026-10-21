<script lang="ts">
  import { page } from '$app/state';
  import { ClipboardCopyButton } from '@lilydesignsystem/svelte-headless';

  let { children } = $props();

  // Only a component's own page (/components/{slug}/) offers its Markdown, never the index.
  const slug = $derived(/^\/components\/([a-z0-9-]+)\/$/.exec(page.url.pathname)?.[1]);

  // The button copies exactly the served file, fetched from the same URL as the visible link; the site holds no second copy.
  let markdown = $state('');
  let status = $state('');

  $effect(() => {
    markdown = '';
    status = '';
    if (!slug) return;
    const wanted = slug;
    fetch(`/components/${wanted}.md`)
      .then((response) => (response.ok ? response.text() : ''))
      .then((text) => {
        if (slug === wanted) markdown = text;
      })
      .catch(() => {});
  });
</script>

{@render children()}

{#if slug}
  <section class="component-markdown" aria-labelledby="markdown-heading" style="max-width: 64rem; margin: 0 auto; padding: 0 1rem 2rem;">
    <h2 id="markdown-heading">Markdown</h2>
    <p>
      This page as Markdown, for people and AI tools:
      <a href={`/components/${slug}.md`}>{slug}.md</a>
    </p>
    {#if markdown}
      <ClipboardCopyButton
        text={markdown}
        label="Copy Markdown"
        onsuccess={() => (status = 'Markdown copied')}
        onerror={() => (status = 'Copying failed')}
      >Copy Markdown</ClipboardCopyButton>
    {/if}
    <p role="status" aria-live="polite">{status}</p>
  </section>
{/if}

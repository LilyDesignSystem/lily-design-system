<!--
  StylesNav — the in-page navigation shared by the seven style-guide pages under /en-001/. The current page is
  marked aria-current; every link text is the page's own name.
-->
<script lang="ts">
  let { current = '' }: { current?: string } = $props();

  const pages = [
    { slug: 'styles', label: 'All styles' },
    { slug: 'principles', label: 'Principles' },
    { slug: 'colours', label: 'Colours' },
    { slug: 'typographies', label: 'Typographies' },
    { slug: 'icons', label: 'Icons' },
    { slug: 'layouts', label: 'Layouts' },
    { slug: 'templates', label: 'Templates' }
  ];
</script>

<nav class="styles-nav" aria-label="Style guide">
  <ul>
    {#each pages as p (p.slug)}
      <li>
        <a href={`/en-001/${p.slug}/`} aria-current={current === p.slug ? 'page' : undefined}>{p.label}</a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  .styles-nav ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    margin: 0 0 1.5rem;
    padding: 0 0 0.75rem;
    list-style: none;
    border-block-end: 1px solid var(--color-base-300, currentColor);
  }
  .styles-nav a {
    text-decoration: none;
    padding-block: 0.25rem;
  }
  .styles-nav a[aria-current='page'] {
    font-weight: 700;
    border-block-end: 3px solid var(--color-primary, currentColor);
  }
</style>

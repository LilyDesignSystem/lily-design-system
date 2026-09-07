<script lang="ts">
  import { LILY_COMPONENTS, type LilyComponent } from '$lib/components';

  let query = $state('');

  const tags: { label: string; filter: string }[] = [
    { label: 'buttons', filter: 'button' },
    { label: 'inputs', filter: 'input' },
    { label: 'lists', filter: 'list' },
    { label: 'tables', filter: 'table' },
    { label: 'navigation', filter: 'nav' },
    { label: 'dialogs', filter: 'dialog' },
    { label: 'pickers', filter: 'picker' },
    { label: 'layouts', filter: 'layout' },
    { label: 'cards', filter: 'card' },
    { label: 'all', filter: '' }
  ];

  const matches: LilyComponent[] = $derived.by(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LILY_COMPONENTS;
    return LILY_COMPONENTS.filter(
      (c) =>
        c.name.includes(q) ||
        c.pascal.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  });

  function applyTag(filter: string) {
    query = filter;
  }
</script>

<svelte:head>
  <title>Components — Lily Design System</title>
  <meta
    name="description"
    content="Browse all components in the Lily Design System. Search by name or description to find what you need."
  />
</svelte:head>

<section class="page-intro">
  <h1>All Lily components</h1>
</section>

<section class="section">
  <ul class="tag-list" aria-label="Common categories">
    {#each tags as tag (tag.label)}
      <li>
        <button
          type="button"
          class="tag"
          onclick={() => applyTag(tag.filter)}
        >
          {tag.label}
        </button>
      </li>
    {/each}
  </ul>

  <label
    for="component-search"
    style="display: block; font-weight: 600; margin-bottom: 0.5rem;"
  >
    Search components
  </label>
  <input
    id="component-search"
    class="component-search"
    type="search"
    placeholder="Try: button, input, list, table, accordion…"
    autocomplete="off"
    bind:value={query}
  />

  <ul class="component-list component-list-stacked" aria-label="Component list">
    {#each matches as component (component.name)}
      <li class="component-list-item">
        <a class="component-list-item-link" href="/components/{component.name}/">
          <span class="component-list-item-name">{component.name}</span>
        </a>:
          <span class="component-list-item-description">{component.description}</span>
      </li>
    {/each}
  </ul>
</section>

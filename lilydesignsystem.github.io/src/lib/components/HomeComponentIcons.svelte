<script lang="ts">
  let { label }: { label: string } = $props();

  const components = [
    ['avatar-image', 'Avatar Image', '/components/avatar-image/'],
    ['bar-chart', 'Bar Chart', '/components/bar-chart/'],
    ['calendar', 'Calendar'],
    ['chat-bubble', 'Chat Bubble', '/components/chat-message/'],
    ['data-grid', 'Data Grid'],
    ['gantt-chart', 'Gantt Chart'],
    ['kanban-board', 'Kanban Board'],
    ['locale-picker', 'Locale Picker'],
    ['search-picker', 'Search Picker'],
    ['settings-picker', 'Settings Picker'],
    ['share-picker', 'Share Picker'],
    ['theme-picker', 'Theme Picker']
  ] as const;
</script>

<ul class="component-icon-row" aria-label={label}>
  {#each components as [slug, name, href] (slug)}
    <li>
      <a
        class="framework-icon-link"
        href={href ?? `https://github.com/LilyDesignSystem/lily-design-system/tree/main/lily-design-system-svelte-${slug}`}
      >
        <img src={`/assets/images/icons/${slug}/64x64.png`} alt="" width="40" height="40" />
        <span lang="en">{name}</span>
      </a>
    </li>
  {/each}
</ul>

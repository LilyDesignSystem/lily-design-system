<!--
  IconRail — a collapsible column of icon buttons. Collapsed it shows only the icons; expanded it shows each icon
  with its label beside it, on the inline-end side (so it reads to the right in English and to the left in Arabic).
  Every button opens the same native modal <dialog> with the demo text. The icon buttons are the headless
  `IconButton`, so each has a required accessible name even while its visible label is hidden.
-->
<script lang="ts">
  import { IconButton } from '@lilydesignsystem/svelte-headless';

  type Item = { id: string; label: string; path: string };

  let {
    items,
    label,
    expanded = $bindable(false),
    expandLabel,
    collapseLabel,
    dialogText,
    closeLabel,
    side
  }: {
    items: Item[];
    /** Accessible name of the navigation landmark. */
    label: string;
    expanded?: boolean;
    expandLabel: string;
    collapseLabel: string;
    dialogText: string;
    closeLabel: string;
    /** Which side of the page the rail sits on; it decides which way the toggle's chevron points. */
    side: 'left' | 'right';
  } = $props();

  const listId = $derived(`demo-rail-${side}`);
  let dialog: HTMLDialogElement | undefined = $state(undefined);
  let current = $state<Item | null>(null);

  function open(item: Item) {
    current = item;
    dialog?.showModal();
  }
  // The chevron points toward where the rail will go: inline-end to open a left rail, inline-start to open a right one.
  const flip = $derived((side === 'left') === expanded);
</script>

<nav class="demo-icon-rail" aria-label={label} data-side={side} data-expanded={expanded} data-flip={flip || undefined}>
  <IconButton
    baseClass="demo-icon-rail-toggle"
    label={expanded ? collapseLabel : expandLabel}
    aria-expanded={expanded}
    aria-controls={listId}
    onclick={() => (expanded = !expanded)}
  >
    <svg class="demo-icon-rail-chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="1.05rem" height="1.05rem">
      <path d="M6 3.5 10.5 8 6 12.5" />
    </svg>
  </IconButton>

  <ul id={listId} class="demo-icon-rail-list">
    {#each items as item (item.id)}
      <li>
        <IconButton baseClass="demo-icon-rail-button" label={item.label} aria-haspopup="dialog" onclick={() => open(item)}>
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="1.05rem" height="1.05rem">
            <path d={item.path} />
          </svg>
          <span class="demo-icon-rail-label">{item.label}</span>
        </IconButton>
      </li>
    {/each}
  </ul>
</nav>

<dialog class="demo-dialog" bind:this={dialog} aria-labelledby={`${listId}-title`}>
  <h2 id={`${listId}-title`}>{current?.label}</h2>
  <p>{dialogText}</p>
  <form method="dialog">
    <button type="submit">{closeLabel}</button>
  </form>
</dialog>

<style>
  .demo-icon-rail {
    display: grid;
    gap: 0.5rem;
    align-content: start;
  }
  .demo-icon-rail-list {
    display: grid;
    gap: 0.25rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  /* Both kinds of button are headless: this is the demo's own look, on the theme's colours. */
  :global(.demo-icon-rail-toggle),
  :global(.demo-icon-rail-button) {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    inline-size: 100%;
    min-block-size: 2.4rem;
    padding: 0.4rem 0.7rem;
    font: inherit;
    text-align: start;
    cursor: pointer;
    color: inherit;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 0.4rem;
  }
  :global(.demo-icon-rail-toggle) {
    border-color: color-mix(in srgb, currentColor 25%, transparent);
  }
  :global(.demo-icon-rail-button:hover),
  :global(.demo-icon-rail-toggle:hover) {
    background: color-mix(in srgb, currentColor 10%, transparent);
  }
  :global(.demo-icon-rail-button:focus-visible),
  :global(.demo-icon-rail-toggle:focus-visible) {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
  :global(.demo-icon-rail-button svg),
  :global(.demo-icon-rail-toggle svg) {
    flex: none;
    margin-inline: auto;
  }
  /* Collapsed: the label is hidden visually (not removed), so the icon centres in the narrow column. */
  .demo-icon-rail[data-expanded='false'] .demo-icon-rail-label {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  /* Expanded: icon first, then its label on the inline-end side. */
  .demo-icon-rail[data-expanded='true'] :global(.demo-icon-rail-button svg) {
    margin-inline: 0;
  }
  .demo-icon-rail-label {
    text-align: start;
  }
  :global(.demo-icon-rail-chevron) {
    transition: transform 0.15s ease;
  }
  .demo-icon-rail[data-flip] :global(.demo-icon-rail-chevron) {
    transform: scaleX(-1);
  }
  :global([dir='rtl']) .demo-icon-rail:not([data-flip]) :global(.demo-icon-rail-chevron) {
    transform: scaleX(-1);
  }
  :global([dir='rtl']) .demo-icon-rail[data-flip] :global(.demo-icon-rail-chevron) {
    transform: none;
  }
  /* On a narrow screen the rail is a row: the toggle, then the icons side by side (scrolling if they must). */
  @media (max-width: 48rem) {
    .demo-icon-rail {
      grid-auto-flow: column;
      grid-template-columns: max-content minmax(0, 1fr);
      align-items: start;
    }
    .demo-icon-rail-list {
      grid-auto-flow: column;
      grid-auto-columns: max-content;
      overflow-x: auto;
    }
    :global(.demo-icon-rail-toggle),
    :global(.demo-icon-rail-button) {
      inline-size: auto;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :global(.demo-icon-rail-chevron) {
      transition: none;
    }
  }
  .demo-dialog {
    max-inline-size: min(26rem, calc(100vw - 2rem));
    padding: 1.25rem 1.5rem;
    color: inherit;
    background: Canvas;
    border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
    border-radius: 0.6rem;
  }
  .demo-dialog::backdrop {
    background: rgb(0 0 0 / 0.45);
  }
  .demo-dialog h2 {
    margin-block: 0 0.5rem;
    font-size: 1.1rem;
  }
</style>

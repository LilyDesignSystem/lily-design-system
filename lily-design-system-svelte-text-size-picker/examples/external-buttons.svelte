<!--
  Example 7 — Driving the picker from your own UI.

  Sometimes you want bigger, more discoverable affordances than a
  dropdown — an A- / A+ pair in a settings page or accessibility
  toolbar, say. Because `value` is a plain bindable prop, your own
  buttons can drive the picker directly: assign to the bound variable
  and the component's own $effect applies the size, writes storage, and
  fires onChange exactly as if the listbox had done it.

  Note the aria-pressed on each preset button — these are toggles, and
  the state must be readable by assistive technology, not just visible
  as a highlight (WCAG 1.4.1: no colour-only meaning).

  This pattern does not require the <TextSizePicker> listbox to be
  rendered at all if you don't want the dropdown in this location — the
  bound `size` variable and a bare <TextSizePicker> elsewhere (or with
  no visible UI beyond the buttons below) still keeps data-text-size,
  localStorage, and onChange in sync.
-->
<script lang="ts">
  import TextSizePicker, { sizeName } from "../TextSizePicker.svelte";

  const sizes = ["small", "medium", "large", "x-large"];

  let size = $state("");
</script>

<TextSizePicker label="Text size" {sizes} bind:value={size} storageKey="my-app:text-size" />

<div role="group" aria-label="Text size presets">
  {#each sizes as slug (slug)}
    <button type="button" aria-pressed={slug === size} onclick={() => (size = slug)}>
      {sizeName(slug)}
    </button>
  {/each}
</div>

<p class="text-size-picker-status" aria-live="polite">
  Text size: {size ? sizeName(size) : "none"}
</p>

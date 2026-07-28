<!--
  Example 1 — Basic usage.

  The minimum viable picker: a label and a slug list. It resolves
  "medium" as the initial active size (since "medium" is in the list),
  and sets data-text-size="medium" on <html>.

  The control is an icon button (the letter "A") that opens a WAI-ARIA
  APG listbox. Its width is one glyph regardless of how many sizes the
  catalog holds.

  Two things this example does NOT ship, because the package is
  headless, and which you must supply yourself:

  1. The CSS that maps each [data-text-size="<slug>"] to a real
     font-size. See ../index.md for a starter rule set.
  2. Positioning CSS for .text-size-picker-list. Without it the listbox
     renders in normal document flow and shoves the page down when it
     opens. See ../docs/accessibility.md § Common mistakes to avoid.

  The status line below is recommended. The listbox marks the active
  option with aria-selected="true", so a screen-reader user who opens
  the control does hear which size is current. But the CLOSED control
  shows only a glyph, and applying a size while the listbox is closed
  produces no announcement at all — see ../docs/accessibility.md §
  How a size change is announced.

  - aria-live="polite" announces *mutations* only, so this stays silent
    on first paint and speaks once on each subsequent change.
  - It is deliberately *visible*: it is the only on-screen statement of
    the active size while the listbox is closed.

  sizeName is the same title-casing function the options use, so the
  status line and the control cannot drift apart.
-->
<script lang="ts">
  import TextSizePicker, { sizeName } from "../TextSizePicker.svelte";

  let size = $state("");
</script>

<TextSizePicker
  label="Text size"
  sizes={["small", "medium", "large", "x-large"]}
  bind:value={size}
/>

<p class="text-size-picker-status" aria-live="polite">
  Text size: {sizeName(size)}
</p>

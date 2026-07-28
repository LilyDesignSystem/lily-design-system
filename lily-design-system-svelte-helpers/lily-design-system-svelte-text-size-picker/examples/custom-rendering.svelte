<!--
  Example 5 — Custom button rendering via the `children` snippet.

  The snippet REPLACES THE GLYPH INSIDE THE TRIGGER BUTTON. It does not
  render the options: the popup <ul role="listbox"> and its
  <li role="option"> children are component-owned, because they carry
  the ids that aria-activedescendant points at, the aria-selected state,
  and the click handlers.

  It receives:
    - value:    the active slug
    - open:     is the listbox open?
    - labelFor: the resolved display label for a slug

  Below we render an inline SVG glyph plus a visible word plus a caret.
  Adding visible text is the recommended mitigation for the icon-only
  naming tradeoff — an icon-only button's accessible name rests entirely
  on aria-label, and a user who does not read "A" as "text size" has
  nothing on screen telling them what the button does. See
  ../docs/accessibility.md § Tradeoff 1.

  The SVG is also the recommended fix for tradeoff 3: the default "A"
  glyph is a font character, so it inherits the page's typeface and —
  being a text-size control — scales with the very setting it adjusts.
  An SVG sized in px stays put regardless of the active size. See
  ../docs/accessibility.md § Tradeoff 3.

  The cost is the narrow control: the button is now as wide as the
  longest size name. That is often the right trade.

  Note the aria-hidden attributes. The button's aria-label is still the
  accessible name and overrides this visible text for assistive
  technology, so keep the two saying the same thing — or switch to
  aria-labelledby pointing at your own visible label.

  Do not render interactive elements in this snippet: its output lives
  inside a <button>, and nesting interactive content inside a button is
  invalid HTML and breaks keyboard behaviour.
-->
<script lang="ts">
  import TextSizePicker from "../TextSizePicker.svelte";

  let size = $state("");
</script>

<TextSizePicker
  label="Text size"
  sizes={["small", "medium", "large", "x-large"]}
  bind:value={size}
>
  {#snippet children({ value, open, labelFor })}
    <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
      <path d="M4 20 L10 4 L16 20 M6.5 14 H13.5" fill="none" stroke="currentColor" stroke-width="2" />
    </svg>
    <span class="text-size-picker-text">{labelFor(value)}</span>
    <span aria-hidden="true">{open ? "▴" : "▾"}</span>
  {/snippet}
</TextSizePicker>

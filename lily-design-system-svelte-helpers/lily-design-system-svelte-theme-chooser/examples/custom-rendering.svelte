<!--
  Example 5 — Custom button rendering via the `children` snippet.

  The snippet REPLACES THE GLYPH INSIDE THE TRIGGER BUTTON. It does not
  render the options: the popup <ul role="listbox"> and its
  <li role="option"> children are component-owned, because they carry
  the ids that aria-activedescendant points at, the aria-selected state,
  and the click handlers.

  (Before the icon-button migration this snippet received
  { themes, value, setTheme, name, labelFor } and drew <option>
  elements. That contract is gone.)

  It now receives:
    - value:    the active slug
    - open:     is the listbox open?
    - labelFor: the resolved display label for a slug

  Below we render the glyph plus a visible word plus a caret. Adding
  visible text is the recommended mitigation for the icon-only naming
  tradeoff — an icon-only button's accessible name rests entirely on
  aria-label, and a user who does not read ◑ as "theme" has nothing
  on screen telling them what the button does. See
  ../docs/accessibility.md § Tradeoff 1.

  The cost is the narrow control: the button is now as wide as the
  longest theme name. That is often the right trade.

  Note the aria-hidden attributes. The button's aria-label is still the
  accessible name and overrides this visible text for assistive
  technology, so keep the two saying the same thing — or switch to
  aria-labelledby pointing at your own visible label.

  An inline SVG here instead of the ◑ character would also remove the
  font dependency described in ../docs/accessibility.md § Tradeoff 3.

  Do not render interactive elements in this snippet: its output lives
  inside a <button>, and nesting interactive content inside a button is
  invalid HTML and breaks keyboard behaviour.
-->
<script lang="ts">
  import ThemeChooser from "../ThemeChooser.svelte";

  let theme = $state("");
</script>

<ThemeChooser
  label="Theme"
  themesUrl="/assets/themes/"
  themes={["light", "dark", "abyss", "cupcake", "dracula"]}
  bind:value={theme}
>
  {#snippet children({ value, open, labelFor })}
    <span aria-hidden="true">&#9681;</span>
    <span class="theme-chooser-text">{labelFor(value)}</span>
    <span aria-hidden="true">{open ? "▴" : "▾"}</span>
  {/snippet}
</ThemeChooser>

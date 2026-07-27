<!--
  Example 1 — Basic usage.

  The minimum viable select: a label, a themes directory, and a slug
  list. The select resolves "light" as the initial active theme (since
  "light" is in the list), sets data-theme="light" on <html>, and
  injects a <link rel="stylesheet"> pointing at /assets/themes/light.css.

  The control is an icon button (a half-circle glyph, U+25D1) that opens
  a WAI-ARIA APG listbox. Its width is one glyph regardless of how many
  themes the catalog holds.

  Two things this example does NOT ship, because the package is
  headless, and which you must supply yourself:

  1. Positioning CSS for .theme-chooser-list. Without it the listbox
     renders in normal document flow and shoves the page down when it
     opens. See ../docs/styling.md § Positioning the listbox.
  2. An active-option indicator. Style both [data-active] (where the
     keyboard cursor is) and [aria-selected="true"] (which theme is
     applied) — they are different states.

  The status line below is recommended, though it is no longer
  compensating for missing semantics the way it was before the listbox
  landed. The listbox marks the active option with aria-selected="true",
  so a screen-reader user who opens the control does hear which theme is
  current. But the CLOSED control shows only a glyph, so nothing on the
  page states the active theme unless you state it.

  - aria-live="polite" announces *mutations* only, so this stays silent
    on first paint and speaks once on each subsequent change.
  - It is deliberately *visible*, which is now the main reason to have
    it: it is the only on-screen statement of the active theme while
    the listbox is closed. See ../docs/accessibility.md § The status
    region.

  themeName is the same function the options use, so the status line
  and the control cannot drift apart.
-->
<script lang="ts">
  import ThemeChooser, { themeName } from "../ThemeChooser.svelte";

  let theme = $state("");
</script>

<ThemeChooser
  label="Theme"
  themesUrl="/assets/themes/"
  themes={["light", "dark", "abyss"]}
  bind:value={theme}
/>

<p class="theme-chooser-status" aria-live="polite">
  Active theme: {themeName(theme)}
</p>

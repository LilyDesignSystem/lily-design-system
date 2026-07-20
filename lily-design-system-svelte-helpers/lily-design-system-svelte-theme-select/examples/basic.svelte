<!--
  Example 1 — Basic usage.

  The minimum viable select: a label, a themes directory, and a slug
  list. The select resolves "light" as the initial active theme (since
  "light" is in the list), sets data-theme="light" on <html>, and
  injects a <link rel="stylesheet"> pointing at /assets/themes/light.css.

  The status line is part of the pattern, not an extra.

  The closed control is placeholder-pinned: it always reads "Theme"
  rather than the active theme name, which is what keeps it one word
  wide. The cost is that a screen reader never hears the active theme
  announced as the combobox value. The <p> below compensates: it is the
  only place the active theme is stated, so ship it (or an equivalent)
  alongside the select rather than treating it as optional. See
  ../docs/accessibility.md.

  Two details worth knowing:

  - aria-live="polite" announces *mutations* only, so this stays silent
    on first paint and speaks once on each subsequent change. That is
    the behaviour we want — no announcement on page load, one clear
    announcement per user action.
  - It is deliberately *visible*, not sr-only. Sighted users, and users
    who benefit from an explicit confirmation of what just changed, get
    the same information; AAA favours showing it. If a design truly
    cannot spare the space, keep the element and the aria-live and hide
    it visually instead (clip-path: inset(50%) — see
    ../docs/styling.md § The status line), but prefer visible.
-->
<script lang="ts">
  import ThemeSelect from "../ThemeSelect.svelte";

  let theme = $state("");

  // The package does not export its label function, so mirror its
  // default title-casing here. If you pass a `themeLabels` map to the
  // select (see custom-labels.svelte), read the label from that same
  // map instead so the select and the status line cannot disagree.
  function labelFor(slug: string): string {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
</script>

<ThemeSelect
  label="Theme"
  themesUrl="/assets/themes/"
  themes={["light", "dark", "abyss"]}
  bind:value={theme}
/>

<p class="theme-select-status" aria-live="polite">
  Active theme: {labelFor(theme)}
</p>

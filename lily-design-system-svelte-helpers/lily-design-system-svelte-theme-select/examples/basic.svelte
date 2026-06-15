<!--
  Example 1 — Basic usage.

  The minimum viable picker: a label, a themes directory, and a slug
  list. The picker resolves "light" as the initial active theme (since
  "light" is in the list), sets data-theme="light" on <html>, and
  injects a <link rel="stylesheet"> pointing at /assets/themes/light.css.
-->
<script lang="ts">
  import ThemeSelect from "../ThemeSelect.svelte";
</script>

<ThemeSelect
  label="Theme"
  themesUrl="/assets/themes/"
  themes={["light", "dark", "abyss"]}
/>

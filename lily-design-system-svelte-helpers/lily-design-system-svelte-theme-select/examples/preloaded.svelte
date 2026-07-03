<!--
  Example 6 — Zero-flicker switching via preloading.

  The default loading strategy fetches the active theme CSS on demand —
  fast, but the first switch to a not-yet-loaded theme incurs a network
  round-trip. To switch instantly, preload all theme CSS files via your
  own <link> tags. Each theme scopes its rules to
  :root[data-theme="<slug>"], so only the rules whose attribute matches
  the live one are applied.

  The select still mutates data-theme; the network round-trip is gone.

  IMPORTANT: when you preload, you can skip the managed <link> entirely
  by using a `target` that already has data-theme set, OR you can leave
  the managed <link> in place — its href will resolve to one of the
  already-cached stylesheets, so the network cost is just a 304.
-->
<svelte:head>
  <link rel="stylesheet" href="/assets/themes/light.css">
  <link rel="stylesheet" href="/assets/themes/dark.css">
  <link rel="stylesheet" href="/assets/themes/abyss.css">
</svelte:head>

<script lang="ts">
  import ThemeSelect from "../ThemeSelect.svelte";
</script>

<ThemeSelect
  label="Theme"
  themesUrl="/assets/themes/"
  themes={["light", "dark", "abyss"]}
/>

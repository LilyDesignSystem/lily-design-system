<!--
  Example 2 — Two-way binding + onChange callback.

  `bind:value` exposes the active slug to surrounding code. `onChange`
  fires after each apply, which is the right hook for analytics, telling
  the server, or notifying a sibling component.
-->
<script lang="ts">
  import ThemeChooser from "../ThemeChooser.svelte";

  let theme = $state("");

  function trackThemeChange(slug: string) {
    // e.g. fetch("/api/preferences", { method: "POST", body: JSON.stringify({ theme: slug }) });
    console.info("theme changed:", slug);
  }
</script>

<ThemeChooser
  label="Theme"
  themesUrl="/assets/themes/"
  themes={["light", "dark", "abyss"]}
  bind:value={theme}
  onChange={trackThemeChange}
/>

<p>Current theme: <strong>{theme || "(resolving…)"}</strong></p>

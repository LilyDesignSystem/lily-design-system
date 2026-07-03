<!--
  Layout that renders the theme select and writes the user's choice
  back to a cookie so the next SSR pass sees it.
-->
<script lang="ts">
  import ThemeSelect from "../../ThemeSelect.svelte";
  import type { Snippet } from "svelte";

  let {
    data,
    children,
  }: {
    data: { theme: string };
    children: Snippet;
  } = $props();

  let theme = $state(data.theme);

  async function persistThemeCookie(slug: string) {
    await fetch("/api/theme", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ theme: slug }),
    });
  }
</script>

<header>
  <ThemeSelect
    label="Theme"
    themesUrl="/assets/themes/"
    themes={["light", "dark", "abyss"]}
    bind:value={theme}
    onChange={persistThemeCookie}
  />
</header>

<main>
  {@render children()}
</main>

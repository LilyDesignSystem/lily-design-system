<!--
  The picker keeps the user's choice in the "lily-theme" cookie itself (its default), so the next request reaches the
  server already carrying it. "Follow this device" is the first option, then Light, Dark and Abyss.
-->
<script lang="ts">
    import ThemePicker from "../../ThemePicker.svelte";
    import type { Snippet } from "svelte";

    let {
        data,
        children,
    }: {
        data: { theme: string };
        children: Snippet;
    } = $props();

    let theme = $state(data.theme);
</script>

<header>
    <ThemePicker
        label="Theme"
        themesUrl="/assets/themes/"
        themes={["light", "dark", "abyss"]}
        systemLabel="Follow this device"
        cookieName="lily-theme"
        bind:value={theme}
    />
</header>

<main>
    {@render children()}
</main>

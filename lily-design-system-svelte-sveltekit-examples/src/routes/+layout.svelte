<script lang="ts">
    import "$lib/css/app-shell.css";
    import SkipLink from "$lib/components/SkipLink/SkipLink.svelte";
    import { ThemePicker } from "lily-design-system-svelte-theme-picker";

    let { children } = $props();

    // Curated switchable themes (plan P3-T1): NHS England for patients is
    // the default visual reference; the rest demonstrate the runtime-swap
    // contract in AGENTS/helpers.md. All 45 files in /themes/ work — this
    // list is an editorial choice, not a technical limit.
    const themes = [
        "united-kingdom-national-health-service-england-for-patients",
        "united-kingdom-national-health-service-england-for-practitioners",
        "united-kingdom-national-health-service-scotland-for-patients",
        "united-kingdom-national-health-service-wales-for-patients",
        "united-kingdom-government-digital-service",
        "united-states-web-design-system",
        "adobe-spectrum",
        "mozilla-protocol",
        "light",
        "dark",
    ];
    const themeLabels = {
        "united-kingdom-national-health-service-england-for-patients": "NHS England (patients)",
        "united-kingdom-national-health-service-england-for-practitioners": "NHS England (practitioners)",
        "united-kingdom-national-health-service-scotland-for-patients": "NHS Scotland (patients)",
        "united-kingdom-national-health-service-wales-for-patients": "NHS Wales (patients)",
        "united-kingdom-government-digital-service": "GOV.UK GDS",
        "united-states-web-design-system": "USWDS",
        "adobe-spectrum": "Adobe Spectrum",
        "mozilla-protocol": "Mozilla Protocol",
        light: "Light",
        dark: "Dark",
    };
</script>

<SkipLink href="#content" label="Skip to main content" />

<div class="site-header">
    <span>Lily Design System — SvelteKit examples</span>
    <ThemePicker
        label="Choose a theme"
        themesUrl="/themes/"
        {themes}
        {themeLabels}
        defaultValue="united-kingdom-national-health-service-england-for-patients"
        storageKey="lily-theme"
    />
</div>

<div id="content">
    {@render children()}
</div>

<footer class="site-footer">
    <p>Lily™ and Lily Design System™ are trademarks.</p>
</footer>

<script lang="ts">
    import "$lib/css/app-shell.css";
    import SkipLink from "$lib/components/SkipLink/SkipLink.svelte";
    import { ThemePicker } from "lily-design-system-svelte-theme-picker";
    import { LocalePicker } from "lily-design-system-svelte-locale-picker";
    import { TextSizePicker } from "lily-design-system-svelte-text-size-picker";

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
    // Locale list is a demo set: it includes Welsh (endonym label comes
    // from the helper) and Arabic so the dir="rtl" flip is exercised.
    const locales = ["en-GB", "cy-GB", "fr-FR", "ar"];
    // Explicit endonym labels: the helper derives endonyms from
    // Intl.DisplayNames, but that is only as good as the browser's ICU
    // data (headless Chromium lacks Welsh, for example, and silently
    // falls back to the English exonym). A consumer that cares about a
    // specific list should say so.
    const localeLabels = {
        "en-GB": "English (UK)",
        "cy-GB": "Cymraeg",
        "fr-FR": "Français",
        ar: "العربية",
    };
    const sizes = ["small", "medium", "large"];
    const sizeLabels = { small: "Small", medium: "Medium", large: "Large" };

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
    <div class="site-header-pickers">
        <ThemePicker
            label="Choose a theme"
            themesUrl="/themes/"
            {themes}
            {themeLabels}
            defaultValue="united-kingdom-national-health-service-england-for-patients"
            storageKey="lily-theme"
        />
        <LocalePicker
            label="Choose a language"
            {locales}
            {localeLabels}
            defaultValue="en-GB"
            storageKey="lily-locale"
        />
        <TextSizePicker
            label="Text size"
            {sizes}
            {sizeLabels}
            defaultValue="medium"
            storageKey="lily-text-size"
        />
    </div>
</div>

<div id="content">
    {@render children()}
</div>

<footer class="site-footer">
    <p>Lily™ and Lily Design System™ are trademarks.</p>
</footer>

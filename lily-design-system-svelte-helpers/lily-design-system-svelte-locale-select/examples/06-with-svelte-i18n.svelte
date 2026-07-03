<!--
    06. Wiring svelte-i18n.

    The select's bindable `value` is wired directly to svelte-i18n's
    `locale` store. Every `$_("key")` call in your templates re-evaluates
    automatically when the user picks a different locale.

    Prerequisites:
        pnpm add svelte-i18n
        // src/lib/i18n.ts
        // import { addMessages, init, register } from "svelte-i18n";
        // register("en", () => import("./messages/en.json"));
        // register("fr", () => import("./messages/fr.json"));
        // register("ar", () => import("./messages/ar.json"));
        // init({ fallbackLocale: "en", initialLocale: "en" });

    Outcome: choosing a locale triggers svelte-i18n to load that
    message bundle and re-render every `$_(...)` placeholder.
-->
<script lang="ts">
    import LocaleSelect from "../LocaleSelect.svelte";
    // import { _, locale as i18nLocale } from "svelte-i18n";

    // Demo-only stand-ins so this file compiles without svelte-i18n installed.
    const i18nLocale = { subscribe: (_: (v: string) => void) => () => {} };
    const _ = (key: string) => key;
</script>

<LocaleSelect
    label="Language"
    locales={["en", "fr", "ar"]}
    localeLabels={{ en: "English", fr: "Français", ar: "العربية" }}
    bind:value={$i18nLocale}
    storageKey="app-locale"
    detectFromNavigator
/>

<h1>{$_("home.heading")}</h1>
<p>{$_("home.body")}</p>

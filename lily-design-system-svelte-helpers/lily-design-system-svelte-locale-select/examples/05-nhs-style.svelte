<!--
    05. NHS UK-style language banner.

    Mirrors the NHS UK Design System's pattern of placing a language
    chooser in a top utility banner. The banner uses native button-
    group markup but with the `locale-select` class hook so consumer
    CSS can target it without duplication.

    Outcome: a <header> banner with the picker rendered as a horizontal
    button list. Each entry shows the language in its own script.
-->
<script lang="ts">
    import LocaleSelect from "../LocaleSelect.svelte";

    let locale = $state("en");

    // Endonyms — each language in its own script.
    const NATIVE: Record<string, string> = {
        en: "English",
        cy: "Cymraeg",
        gd: "Gàidhlig",
        ga: "Gaeilge",
        fr: "Français",
        pl: "Polski",
        ur: "اردو",
        bn: "বাংলা",
        zh_Hant: "繁體中文",
    };
</script>

<header class="utility-banner" aria-label="Site utilities">
    <span>NHS</span>

    <LocaleSelect
        label="Language"
        locales={["en", "cy", "gd", "ga", "fr", "pl", "ur", "bn", "zh_Hant"]}
        localeLabels={NATIVE}
        bind:value={locale}
        storageKey="nhs-locale"
        class="utility-banner-languages"
    >
        {#snippet children({ locales, value, setLocale, labelFor, tagFor })}
            <ul class="locale-select-list" role="list">
                {#each locales as l (l)}
                    <li>
                        <button
                            type="button"
                            aria-pressed={value === l}
                            lang={tagFor(l)}
                            onclick={() => setLocale(l)}
                        >
                            {labelFor(l)}
                        </button>
                    </li>
                {/each}
            </ul>
        {/snippet}
    </LocaleSelect>
</header>

<main lang={locale.replace(/_/g, "-")}>
    <h1>Welcome</h1>
    <p>Current locale: <code>{locale}</code></p>
</main>

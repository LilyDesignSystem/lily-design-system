<!--
    03. Toggle-button group via the children snippet.

    A button group renders the locales inline with `aria-pressed` to
    indicate the active locale. Use it when you want a more prominent,
    tap-friendly affordance than a radio group on small screens, or
    when you want to render flags / abbreviations.

    Outcome: a horizontal <ul> of <button>s. The picker still drives
    lang/dir/onChange.
-->
<script lang="ts">
    import LocaleSelect from "../LocaleSelect.svelte";

    let locale = $state("en");

    // Short two-letter codes for compact display.
    const SHORT: Record<string, string> = {
        en: "EN",
        fr: "FR",
        es: "ES",
        de: "DE",
        ar: "ع",
        he: "ע",
    };
</script>

<LocaleSelect
    label="Language"
    locales={["en", "fr", "es", "de", "ar", "he"]}
    bind:value={locale}
>
    {#snippet children({ locales, value, setLocale, labelFor, tagFor, isRtl })}
        <ul class="locale-select-list" role="list">
            {#each locales as l (l)}
                <li>
                    <button
                        type="button"
                        aria-pressed={value === l}
                        lang={tagFor(l)}
                        dir={isRtl(l) ? "rtl" : "ltr"}
                        title={labelFor(l)}
                        onclick={() => setLocale(l)}
                    >
                        {SHORT[l] ?? l.toUpperCase()}
                    </button>
                </li>
            {/each}
        </ul>
    {/snippet}
</LocaleSelect>

<p>Selected: <code>{locale}</code> — {locale}</p>

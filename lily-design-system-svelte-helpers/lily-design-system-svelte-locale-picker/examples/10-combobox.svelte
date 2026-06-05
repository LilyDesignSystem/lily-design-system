<!--
    10. Combobox with native <datalist> type-ahead.

    For long locale lists (50+) where a radio group is impractical and
    a `<select>` is too tedious to scroll. Uses an `<input list>` +
    `<datalist>` for native, accessible type-ahead. The picker
    validates the typed value against the supported set before
    applying.

    Outcome: type "Fr" — the combobox shows "Français", "Français
    (Canada)", "Frisian", etc. Pick one and the picker applies.

    Browser support note: native <datalist> is widely supported but
    iOS Safari's UX is limited. For a fully APG-compliant combobox,
    swap in Lily's headless Combobox primitive.
-->
<script lang="ts">
    import LocalePicker, {
        defaultLocaleLabels,
    } from "../LocalePicker.svelte";

    // All 436 locale codes from the built-in table.
    const ALL_LOCALES = Object.keys(defaultLocaleLabels);

    let locale = $state("en");
    let inputValue = $state("");
</script>

<LocalePicker
    label="Language"
    locales={ALL_LOCALES}
    bind:value={locale}
    storageKey="combobox-locale"
>
    {#snippet children({ locales, value, setLocale, labelFor, tagFor })}
        <input
            type="text"
            list="locale-options"
            placeholder="Start typing a language…"
            aria-label="Language"
            value={inputValue || labelFor(value)}
            oninput={(e) => {
                inputValue = (e.currentTarget as HTMLInputElement).value;
            }}
            onchange={(e) => {
                const typed = (e.currentTarget as HTMLInputElement).value;
                // Find the locale whose label matches the typed text.
                const match = locales.find(
                    (l) => labelFor(l).toLowerCase() === typed.toLowerCase(),
                );
                if (match) {
                    setLocale(match);
                    inputValue = "";
                }
            }}
        />
        <datalist id="locale-options">
            {#each locales as l (l)}
                <option value={labelFor(l)} lang={tagFor(l)}>{l}</option>
            {/each}
        </datalist>
    {/snippet}
</LocalePicker>

<p>Selected locale: <code>{locale}</code> ({defaultLocaleLabels[locale]})</p>

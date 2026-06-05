<!--
    02. Native <select> via the children snippet.

    The picker still owns the lifecycle (lang/dir/storage/onChange) but
    delegates the markup to a <select>. Best for >~12 locales or when
    the design system uses dropdowns for setting controls.

    Outcome: a single <select> populated with one <option> per locale,
    each carrying its own BCP 47 `lang`. The picker's $effect runs the
    same way as the default rendering.
-->
<script lang="ts">
    import LocalePicker from "../LocalePicker.svelte";

    let locale = $state("en");
</script>

<LocalePicker
    label="Language"
    locales={["en", "en_US", "en_GB", "fr", "fr_CA", "es", "es_419", "de", "zh_Hans", "zh_Hant", "ja", "ko", "ar", "he", "fa", "ur", "hi", "bn", "pt", "pt_BR", "ru", "tr", "vi"]}
    bind:value={locale}
    storageKey="app-locale"
    detectFromNavigator
>
    {#snippet children({ locales, value, setLocale, labelFor, tagFor })}
        <select
            class="locale-picker-select"
            aria-label="Language"
            value={value}
            onchange={(e) => setLocale((e.currentTarget as HTMLSelectElement).value)}
        >
            {#each locales as l (l)}
                <option value={l} lang={tagFor(l)}>{labelFor(l)}</option>
            {/each}
        </select>
    {/snippet}
</LocalePicker>

<p>Selected locale: <code>{locale}</code></p>

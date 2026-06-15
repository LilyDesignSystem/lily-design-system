<!--
    01. Default radio group.

    The simplest possible mount. Each radio renders with its locale's
    pretty name (from the built-in `locales.tsv` table), wrapped in a
    `<label lang="…">` so screen readers pronounce each in the right
    language.

    Outcome: a fieldset with three radios. Picking one writes
    `<html lang="…" dir="…">` and updates the bindable `value`.
-->
<script lang="ts">
    import LocaleSelect from "../LocaleSelect.svelte";

    let locale = $state("en");
</script>

<LocaleSelect
    label="Choose your language"
    locales={["en", "fr", "ar"]}
    bind:value={locale}
/>

<p>Selected locale: <code>{locale}</code></p>

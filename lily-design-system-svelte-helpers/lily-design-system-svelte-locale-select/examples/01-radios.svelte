<!--
    01. Default rendering.

    The simplest possible mount. The select renders one native
    <option> per locale, each with its locale's pretty name (from the
    built-in `locales.tsv` table) and a `lang="…"` attribute so screen
    readers pronounce each in the right language.

    Outcome: a native <select> with three options. Picking one writes
    <html lang="…" dir="…"> and updates the bindable `value`.

    The status line is part of the pattern, not an extra.

    The closed control is placeholder-pinned: it always reads "Choose
    your language" rather than the active locale name, which is what
    keeps it that narrow. The cost is that a screen reader never hears
    the active locale announced as the combobox value. That matters
    more here than for most controls — someone who has landed on a page
    in a language they cannot read needs to confirm what the control is
    currently set to. The <p> below is the only place the active locale
    is stated, so ship it (or an equivalent) alongside the select
    rather than treating it as optional. See ../docs/accessibility.md.

    Two details worth knowing:

    - aria-live="polite" announces *mutations* only, so this stays
      silent on first paint and speaks once on each subsequent change.
      That is the behaviour we want — no announcement on page load, one
      clear announcement per user action.
    - It is deliberately *visible*, not sr-only. Sighted users, and
      users who benefit from an explicit confirmation of what just
      changed, get the same information; AAA favours showing it. If a
      design truly cannot spare the space, keep the element and the
      aria-live and hide it visually instead (clip-path: inset(50%)),
      but prefer visible.

    The status line carries no `lang` override: the built-in labels in
    `locales.tsv` are ENGLISH names ("French", "Arabic"), so the whole
    sentence is English and marking the name as fr/ar would tell a
    screen reader to pronounce an English word with a French or Arabic
    voice. If you supply endonyms via `localeLabels`
    ({ fr: "Français" }), wrap just the name in
    <span lang={bcp47LocaleTag(locale)}> so WCAG 3.1.2 (Language of
    Parts) is satisfied for that fragment.
-->
<script lang="ts">
    import LocaleSelect, { localeName } from "../LocaleSelect.svelte";

    let locale = $state("en");
</script>

<LocaleSelect
    label="Choose your language"
    locales={["en", "fr", "ar"]}
    bind:value={locale}
/>

<p class="locale-select-status" aria-live="polite">
    Active language: {localeName(locale)}
</p>

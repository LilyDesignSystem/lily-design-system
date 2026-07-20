<!--
    Many locales — a long list in a one-glyph control.

    This is the case the icon button exists for. Twenty-three locales,
    several with long names ("English (United States)", "Chinese
    (Traditional)"), and the closed control is still exactly one glyph
    wide. A native <select> would be as wide as its longest option, or
    would truncate it.

    (This file used to render a custom <select> through the children
    snippet. That is no longer possible: the snippet replaces the
    button's glyph, not the options. The default listbox handles long
    lists directly.)

    What makes a long list workable:

    - Typeahead. Type a printable character and the active option jumps
      to the first label with that prefix; the buffer resets after
      500 ms and the search wraps once. Note it matches the LABEL, so
      with the built-in English names a user types "Fr" for French; if
      you supply endonyms they must type "Fra" for "Français". Pick
      deliberately for your audience.
    - Home / End to reach the ends without arrowing through everything.
    - Arrow keys CLAMP rather than wrap, so holding ArrowDown parks at
      the last option instead of cycling silently past it.

    Two things you must supply for a list this long:

    1. A scroll container. Set max-block-size and overflow-y on
       .locale-select-list. The component calls
       scrollIntoView({ block: "nearest" }) on the active option, which
       only does something useful if the list actually scrolls.
    2. A min-inline-size, so the popup does not jump width as the
       longest visible label changes.

    See ../docs/styling.md § Positioning the listbox.

    A caution: `locales` should be the set your app actually supports,
    not every code you can name. Offering a language you have no
    translations for is worse than not offering it. And if you truly
    need to pick from hundreds, an APG Combobox with a text input is the
    right pattern — that is not this component, and the snippet cannot
    add one, because its output lives inside a <button>.
-->
<script lang="ts">
    import LocaleSelect, { localeName } from "../LocaleSelect.svelte";

    let locale = $state("en");
</script>

<LocaleSelect
    label="Language"
    locales={[
        "en", "en_US", "en_GB", "fr", "fr_CA", "es", "es_419", "de",
        "zh_Hans", "zh_Hant", "ja", "ko", "ar", "he", "fa", "ur",
        "hi", "bn", "pt", "pt_BR", "ru", "tr", "vi",
    ]}
    bind:value={locale}
    storageKey="app-locale"
    detectFromNavigator
/>

<p class="locale-select-status" aria-live="polite">
    Active language: {localeName(locale)} (<code>{locale}</code>)
</p>

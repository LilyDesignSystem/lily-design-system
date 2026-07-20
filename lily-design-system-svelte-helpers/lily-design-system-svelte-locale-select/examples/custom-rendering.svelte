<!--
    Custom rendering — replacing the button's glyph.

    The children snippet REPLACES THE GLYPH INSIDE THE TRIGGER BUTTON.
    It does not render the options: the popup <ul role="listbox"> and
    its <li role="option"> children are component-owned, because they
    carry the ids that aria-activedescendant points at, the
    aria-selected state, the per-option lang attributes, and the click
    handlers.

    (This file used to render a toggle-button group with aria-pressed,
    through the old ChildArgs
    { locales, value, setLocale, name, labelFor, tagFor, isRtl }. That
    contract is gone. An always-visible button group is no longer
    something this component can host — read `value` and drive your own
    controls if you need one.)

    ChildArgs is now:
      - value:    the active code, in consumer form
      - open:     is the listbox open?
      - labelFor: the resolved display label for a code

    tagFor and isRtl are gone from the args, but their implementations
    are exported as pure helpers — bcp47LocaleTag and isRtlLocale —
    which is what we import below.

    Below we render the globe plus the ACTIVE LOCALE'S ENDONYM. This is
    the strongest available mitigation for the icon-only naming
    tradeoff, and it matters more for a locale select than for anything
    else in the catalog:

      An icon-only button's accessible name rests entirely on
      aria-label — and aria-label is written in ONE language. A user who
      speaks only Arabic gets nothing from label="Language" and nothing
      from a bare glyph. The active locale's own name, in its own
      script, is readable by exactly the person who needs it.

    See ../docs/accessibility.md § Tradeoff 1.

    The cost is the narrow control: the button is now as wide as the
    longest endonym. For a locale select that is usually the right
    trade.

    Details worth copying:

    - lang on the <span> carries WCAG 3.1.2 (Language of Parts) onto the
      trigger, so "Français" is pronounced in a French voice. This is
      only correct BECAUSE the labels are endonyms — with the built-in
      English names, drop the lang.
    - dir on the same span scopes bidi handling to the name itself,
      which matters when an RTL endonym sits inside an otherwise-LTR
      button.
    - aria-hidden on the glyph: the button's aria-label remains the
      single accessible name, and it overrides this visible text for
      assistive technology. Keep the two saying the same thing, or
      switch to aria-labelledby pointing at your own visible label.

    Do not render interactive elements in this snippet: its output lives
    inside a <button>, and nesting interactive content inside a button
    is invalid HTML and breaks keyboard behaviour.
-->
<script lang="ts">
    import LocaleSelect, {
        bcp47LocaleTag,
        isRtlLocale,
    } from "../LocaleSelect.svelte";

    let locale = $state("en");

    // Endonyms — each language written in its own script.
    const NATIVE: Record<string, string> = {
        en: "English",
        fr: "Français",
        es: "Español",
        de: "Deutsch",
        ar: "العربية",
        he: "עברית",
    };
</script>

<LocaleSelect
    label="Language"
    locales={["en", "fr", "es", "de", "ar", "he"]}
    localeLabels={NATIVE}
    bind:value={locale}
>
    {#snippet children({ value, open, labelFor })}
        <span aria-hidden="true">🌐︎</span>
        <span
            class="locale-select-text"
            lang={bcp47LocaleTag(value)}
            dir={isRtlLocale(value) ? "rtl" : "ltr"}
        >
            {labelFor(value)}
        </span>
        <span aria-hidden="true">{open ? "▴" : "▾"}</span>
    {/snippet}
</LocaleSelect>

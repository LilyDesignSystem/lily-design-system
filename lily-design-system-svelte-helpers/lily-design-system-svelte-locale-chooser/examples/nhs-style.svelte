<!--
    NHS style — a utility-banner language switcher.

    Mirrors the NHS UK Design System's pattern of placing a language
    chooser in a top utility banner, where horizontal space is scarce
    and shared with other utilities. That is exactly the constraint the
    icon button is for: nine languages, one glyph of banner width.

    (This file used to render a horizontal button list through the
    children snippet. The snippet now replaces the button's glyph, not
    the options, so the banner uses the default listbox and styles it
    through the `class` hook.)

    Choices worth copying:

    - ENDONYMS via localeLabels. Each language written in its own
      script — Cymraeg, Gàidhlig, اردو, বাংলা. For a public-service
      language switcher this is close to mandatory: the user who needs
      the control is by definition the user who cannot read the default
      language, and "Welsh" helps them less than "Cymraeg".
    - The endonym on the TRIGGER as well as in the list, via the
      children snippet. The aria-label is written in one language;
      the active endonym is readable by whoever is actually looking.
      See ../docs/accessibility.md § Tradeoff 1.
    - A `class` hook so the banner's CSS can target this instance
      without duplicating the base .locale-chooser rules.
    - storageKey so the choice survives navigation. For a real service,
      prefer a cookie so the SERVER can paint the right language on
      first byte — a locale flash is far more disruptive than a theme
      flash. See ../docs/ssr.md and ssr-cookie.svelte.

    A caution before adopting this shape for a public service: an
    icon-only trigger with a hand-rolled listbox has weaker
    assistive-technology and mobile support than a native <select>, and
    public-service audiences skew towards exactly the older AT and
    mobile devices where that gap is widest. A plain
    <select aria-label> with one <option lang> per locale is about
    fifteen lines, inherits the platform's behaviour, and may well be
    the better call here. That tradeoff is set out honestly in
    ../docs/accessibility.md § Tradeoff 2 — read it before shipping this
    to patients.

    Typeahead note: because the labels are endonyms, a user reaches
    Welsh by typing "Cy", not "We".
-->
<script lang="ts">
    import LocaleChooser, { bcp47LocaleTag } from "../LocaleChooser.svelte";

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

    <LocaleChooser
        label="Language"
        locales={["en", "cy", "gd", "ga", "fr", "pl", "ur", "bn", "zh_Hant"]}
        localeLabels={NATIVE}
        bind:value={locale}
        storageKey="nhs-locale"
        class="utility-banner-languages"
    >
        {#snippet children({ value, labelFor })}
            <span aria-hidden="true">🌐︎</span>
            <span class="locale-chooser-text" lang={bcp47LocaleTag(value)}>
                {labelFor(value)}
            </span>
        {/snippet}
    </LocaleChooser>
</header>

<main>
    <h1>Welcome</h1>
    <p>Current locale: <code>{locale}</code></p>
</main>

<!--
    The select writes lang and dir onto <html>, so <main> inherits the
    document language — no per-element lang needed here. (The previous
    version of this file set lang on <main> by hand, which duplicated
    what the select already does and could drift out of sync with it.)
-->

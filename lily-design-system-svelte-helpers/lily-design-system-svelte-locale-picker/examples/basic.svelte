<!--
    Basic — the default rendering.

    The simplest possible mount. The control is an icon button (a globe
    glyph) that opens a WAI-ARIA APG listbox. Each option carries its
    locale's pretty name from the built-in `locales.tsv` table and a
    `lang="…"` attribute so screen readers pronounce it in the right
    language.

    Picking one writes <html lang="…" dir="…"> and updates the bindable
    `value`. The control's width is one glyph regardless of how many
    locales you offer.

    Two things this example does NOT ship, because the package is
    headless, and which you must supply yourself:

    1. Positioning CSS for .locale-chooser-list. Without it the listbox
       renders in normal document flow and shoves the page down when it
       opens. Use logical properties (inset-inline-start, not left) —
       this control flips the page to RTL, and a popup pinned with
       `left: 0` ends up on the wrong edge exactly when it matters.
       See ../docs/styling.md § Positioning the listbox.
    2. An active-option indicator. Style both [data-active] (where the
       keyboard cursor is) and [aria-selected="true"] (which locale is
       applied) — they are different states.

    The status line below is recommended, though it is no longer
    compensating for missing semantics the way it was before the
    listbox landed. The listbox marks the active option with
    aria-selected="true", so a screen-reader user who opens the control
    does hear which locale is current. But the CLOSED control shows only
    a glyph, and unlike a theme select, the active locale is not
    something a user can infer by looking — unless they can already read
    the page, which is the one thing this control cannot assume.

    - aria-live="polite" announces *mutations* only, so this stays
      silent on first paint and speaks once on each subsequent change.
    - It is deliberately *visible*: it is the only on-screen statement
      of the active language while the listbox is closed. If a design
      truly cannot spare the space, keep the element and the aria-live
      and hide it visually instead (clip-path: inset(50%)), but prefer
      visible. See ../docs/accessibility.md § The status region.

    The status line carries no `lang` override here: the built-in labels
    in `locales.tsv` are ENGLISH names ("French", "Arabic"), so the
    whole sentence is English, and marking the name as fr/ar would tell
    a screen reader to pronounce an English word with a French or Arabic
    voice. If you supply endonyms via `localeLabels` ({ fr: "Français" }),
    wrap just the name in <span lang={bcp47LocaleTag(locale)}> so
    WCAG 3.1.2 (Language of Parts) is satisfied for that fragment.
-->
<script lang="ts">
    import LocaleChooser, { localeName } from "../LocaleChooser.svelte";

    let locale = $state("en");
</script>

<LocaleChooser
    label="Choose your language"
    locales={["en", "fr", "ar"]}
    bind:value={locale}
/>

<p class="locale-chooser-status" aria-live="polite">
    Active language: {localeName(locale)}
</p>

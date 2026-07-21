<!--
    Default rendering.

    The simplest possible mount. The component renders a
    <div class="locale-chooser"> holding a hidden input, a
    <button class="locale-chooser-button"> showing the globe glyph
    (🌐, U+1F310), and a <ul class="locale-chooser-list" role="listbox">
    with one <li class="locale-chooser-option" role="option"> per locale,
    each showing its locale's pretty name (from the built-in
    `locales.tsv` table). Each option carries `lang="…"` so screen
    readers pronounce the name in the right language.

    Outcome: a compact globe button. Opening it lists three locales;
    picking one writes `<html lang="…" dir="…">` and updates the
    bindable `value`.

    The status line is part of the basic pattern, not an add-on.
    ------------------------------------------------------------------
    The control is icon-only: the closed button shows a glyph and
    nothing else, so the active locale has no on-screen representation
    and is not announced as any control's value. The
    <p class="locale-chooser-status"> below is the compensating channel,
    and it is the default pattern this package ships — see
    ../docs/accessibility.md.

    Two details worth copying verbatim:

    - It is VISIBLE, not sr-only. Sighted users benefit too: with only a
      glyph on the closed button, the active locale is otherwise
      invisible, which matters for cognitive accessibility. If your
      design genuinely cannot spare the line, hide it with a
      visually-hidden (clip-path) rule rather than deleting it —
      `display: none` would silence the live region entirely.

    - aria-live="polite" announces MUTATIONS only, so this stays silent
      on first paint and speaks once on each subsequent change. That is
      the intended behaviour: no announcement on page load, one polite
      announcement per user action, and no focus movement — which is
      also the WCAG 3.2.2 (On Input) contract.

    Note on `lang`: the built-in labels from `locales.tsv` are English
    names ("French", "Arabic"), so this whole line is English and needs
    no `lang` override. If you swap in endonym labels via
    `localeLabels` ("Français", "العربية"), wrap just the name in
    `<span :lang="bcp47LocaleTag(locale)">` so it is pronounced in its
    own language (WCAG 3.1.2, Language of Parts).
-->
<script setup lang="ts">
import { ref } from "vue";
import LocaleChooser, { localeName } from "../LocaleChooser.vue";

const locale = ref("en");
</script>

<template>
    <LocaleChooser
        label="Choose your language"
        :locales="['en', 'fr', 'ar']"
        v-model:value="locale"
    />

    <p class="locale-chooser-status" aria-live="polite">
        Current language: {{ localeName(locale) }}
    </p>

    <p>Selected locale: <code>{{ locale }}</code></p>
</template>

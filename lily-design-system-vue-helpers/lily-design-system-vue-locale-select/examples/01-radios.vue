<!--
    01. Default native <select> rendering.

    The simplest possible mount. The select renders a native
    `<select>` with one `<option>` per locale, each option showing its
    locale's pretty name (from the built-in `locales.tsv` table). Each
    `<option>` carries `lang="…"` so screen readers pronounce the name
    in the right language.

    Outcome: a `<select>` with three `<option>` elements. Picking one
    writes `<html lang="…" dir="…">` and updates the bindable `value`.

    The status line is part of the basic pattern, not an add-on.
    ------------------------------------------------------------------
    The closed <select> is placeholder-pinned: it always reads the
    placeholder word, never "French". That keeps the control narrow no
    matter how long the locale names are, but it means a screen-reader
    user never hears the active locale announced as the combobox value.
    The <p class="locale-select-status"> below is the compensating
    channel, and it is the default pattern this package ships — see
    ../docs/accessibility.md.

    Two details worth copying verbatim:

    - It is VISIBLE, not sr-only. Sighted users benefit too: the active
      locale is otherwise invisible once the control snaps back to the
      placeholder, which matters for cognitive accessibility. If your
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
import LocaleSelect, { localeName } from "../LocaleSelect.vue";

const locale = ref("en");
</script>

<template>
    <LocaleSelect
        label="Choose your language"
        :locales="['en', 'fr', 'ar']"
        v-model:value="locale"
    />

    <p class="locale-select-status" aria-live="polite">
        Current language: {{ localeName(locale) }}
    </p>

    <p>Selected locale: <code>{{ locale }}</code></p>
</template>

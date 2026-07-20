<!--
    Script-aware glyph: the active locale rendered in its own
    script, via the default scoped slot.

    Before the icon-button rewrite this example replaced the whole
    control with a toggle-button group. That is no longer what the slot
    does: the slot replaces the BUTTON GLYPH only, and the listbox is
    component-owned. What survives is the useful part — a compact,
    tap-friendly affordance showing the current language rather than a
    generic globe.

    Slot args: { value, open, labelFor }. Everything script-related
    (BCP 47 tag, RTL detection) comes from the package's exported pure
    helpers, which are unchanged and importable anywhere.

    Outcome: a button reading "EN", "ع", "ע" — each in its own script
    and direction — that opens the standard listbox.

    Note the `lang` / `dir` on the glyph span. The document root already
    gets both from the component, but the glyph shows a language that is
    not necessarily the active one mid-interaction, so tagging it keeps
    WCAG 3.1.2 (Language of Parts) honest and stops a bidi glyph from
    reordering its neighbours.
-->
<script setup lang="ts">
import { ref } from "vue";
import LocaleSelect, {
    bcp47LocaleTag,
    isRtlLocale,
} from "../LocaleSelect.vue";

const locale = ref("en");

// Short codes / glyphs for compact display, each in its own script.
const SHORT: Record<string, string> = {
    en: "EN",
    fr: "FR",
    es: "ES",
    de: "DE",
    ar: "ع",
    he: "ע",
};
</script>

<template>
    <LocaleSelect
        label="Language"
        :locales="['en', 'fr', 'es', 'de', 'ar', 'he']"
        v-model:value="locale"
    >
        <template #default="{ value, open, labelFor }">
            <span
                class="locale-select-code"
                :lang="bcp47LocaleTag(value)"
                :dir="isRtlLocale(value) ? 'rtl' : 'ltr'"
                :title="labelFor(value)"
                aria-hidden="true"
                >{{ SHORT[value] ?? value.toUpperCase() }}</span
            >
            <span class="locale-select-caret" aria-hidden="true">{{
                open ? "▴" : "▾"
            }}</span>
        </template>
    </LocaleSelect>

    <p>Selected: <code>{{ locale }}</code></p>
</template>

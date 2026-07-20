<!--
    Custom button glyph via the default scoped slot.

    The control is an icon button that opens a listbox. By default the
    button shows a globe glyph (U+1F310) inside
    <span class="locale-select-icon" aria-hidden="true">. The default
    slot REPLACES that glyph — as of the icon-button rewrite it no
    longer renders the options, so the listbox, the option markup, the
    keyboard contract, and the apply lifecycle (lang/dir/storage/change)
    all stay component-owned.

    Slot args: { value, open, labelFor }.

    Below, the glyph becomes the active locale's short code ("EN",
    "FR", "AR") — a common choice when the globe alone is too vague and
    you want the current selection visible on the closed control.

    Outcome: a compact button reading "EN ▾" that opens the same
    listbox the default rendering uses.

    Accessibility note: this text is decorative. The button's
    accessible name comes from `label` via aria-label, so the glyph is
    marked aria-hidden="true" to avoid a competing name. Sighted users
    read the current locale off the code; screen-reader users get it
    from the .locale-select-status live region (see basic.vue).
-->
<script setup lang="ts">
import { ref } from "vue";
import LocaleSelect, { localeName } from "../LocaleSelect.vue";

const locale = ref("en");

/** Short display code for a locale: "en_US" -> "EN". */
function shortCode(code: string): string {
    return (code.split(/[-_]/)[0] || code).toUpperCase();
}
</script>

<template>
    <LocaleSelect
        label="Language"
        :locales="[
            'en', 'en_US', 'en_GB',
            'fr', 'fr_CA',
            'es', 'es_419',
            'de',
            'zh_Hans', 'zh_Hant',
            'ja', 'ko',
            'ar', 'he', 'fa', 'ur',
            'hi', 'bn',
            'pt', 'pt_BR',
            'ru', 'tr', 'vi',
        ]"
        v-model:value="locale"
        storage-key="app-locale"
        detect-from-navigator
    >
        <template #default="{ value, open, labelFor }">
            <span
                class="locale-select-code"
                :title="labelFor(value)"
                aria-hidden="true"
                >{{ shortCode(value) }}</span
            >
            <span class="locale-select-caret" aria-hidden="true">{{
                open ? "▴" : "▾"
            }}</span>
        </template>
    </LocaleSelect>

    <p class="locale-select-status" aria-live="polite">
        Current language: {{ localeName(locale) }}
    </p>

    <p>Selected locale: <code>{{ locale }}</code></p>
</template>

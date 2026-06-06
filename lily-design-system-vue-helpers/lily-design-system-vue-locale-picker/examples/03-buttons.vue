<!--
    03. Toggle-button group via the default scoped slot.

    A button group renders the locales inline with `aria-pressed` to
    indicate the active locale. Use it when you want a more prominent,
    tap-friendly affordance than a radio group on small screens, or
    when you want to render flags / abbreviations.

    Outcome: a horizontal <ul> of <button>s. The picker still drives
    lang/dir/change.
-->
<script setup lang="ts">
import { ref } from "vue";
import LocalePicker from "../LocalePicker.vue";

const locale = ref("en");

// Short two-letter codes for compact display.
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
    <LocalePicker
        label="Language"
        :locales="['en', 'fr', 'es', 'de', 'ar', 'he']"
        v-model:value="locale"
    >
        <template
            #default="{ locales, value, setLocale, labelFor, tagFor, isRtl }"
        >
            <ul class="locale-picker-list" role="list">
                <li v-for="l in locales" :key="l">
                    <button
                        type="button"
                        :aria-pressed="value === l"
                        :lang="tagFor(l)"
                        :dir="isRtl(l) ? 'rtl' : 'ltr'"
                        :title="labelFor(l)"
                        @click="setLocale(l)"
                    >
                        {{ SHORT[l] ?? l.toUpperCase() }}
                    </button>
                </li>
            </ul>
        </template>
    </LocalePicker>

    <p>Selected: <code>{{ locale }}</code></p>
</template>

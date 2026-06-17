<!--
    01. Default native <select> rendering.

    The simplest possible mount. The picker renders a native
    `<select>` with one `<option>` per locale, each option showing its
    locale's pretty name (from the built-in `locales.tsv` table). Each
    `<option>` carries `lang="…"` so screen readers pronounce the name
    in the right language.

    Outcome: a `<select>` with three `<option>` elements. Picking one
    writes `<html lang="…" dir="…">` and updates the bindable `value`.
-->
<script setup lang="ts">
import { ref } from "vue";
import LocaleSelect from "../LocaleSelect.vue";

const locale = ref("en");
</script>

<template>
    <LocaleSelect
        label="Choose your language"
        :locales="['en', 'fr', 'ar']"
        v-model:value="locale"
    />

    <p>Selected locale: <code>{{ locale }}</code></p>
</template>

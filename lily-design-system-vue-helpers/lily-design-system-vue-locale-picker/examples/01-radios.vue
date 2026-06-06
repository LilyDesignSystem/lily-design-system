<!--
    01. Default radio group.

    The simplest possible mount. Each radio renders with its locale's
    pretty name (from the built-in `locales.tsv` table), wrapped in a
    `<label lang="…">` so screen readers pronounce each in the right
    language.

    Outcome: a fieldset with three radios. Picking one writes
    `<html lang="…" dir="…">` and updates the bindable `value`.
-->
<script setup lang="ts">
import { ref } from "vue";
import LocalePicker from "../LocalePicker.vue";

const locale = ref("en");
</script>

<template>
    <LocalePicker
        label="Choose your language"
        :locales="['en', 'fr', 'ar']"
        v-model:value="locale"
    />

    <p>Selected locale: <code>{{ locale }}</code></p>
</template>

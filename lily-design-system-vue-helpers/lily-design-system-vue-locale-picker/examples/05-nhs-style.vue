<!--
    05. NHS UK-style language banner.

    Mirrors the NHS UK Design System's pattern of placing a language
    chooser in a top utility banner. The banner uses native button-
    group markup but with the `locale-picker` class hook so consumer
    CSS can target it without duplication.

    Outcome: a <header> banner with the picker rendered as a horizontal
    button list. Each entry shows the language in its own script.
-->
<script setup lang="ts">
import { ref } from "vue";
import LocalePicker from "../LocalePicker.vue";

const locale = ref("en");

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

<template>
    <header class="utility-banner" aria-label="Site utilities">
        <span>NHS</span>

        <LocalePicker
            label="Language"
            :locales="[
                'en', 'cy', 'gd', 'ga',
                'fr', 'pl', 'ur', 'bn', 'zh_Hant',
            ]"
            :locale-labels="NATIVE"
            v-model:value="locale"
            storage-key="nhs-locale"
            class="utility-banner-languages"
        >
            <template
                #default="{ locales, value, setLocale, labelFor, tagFor }"
            >
                <ul class="locale-picker-list" role="list">
                    <li v-for="l in locales" :key="l">
                        <button
                            type="button"
                            :aria-pressed="value === l"
                            :lang="tagFor(l)"
                            @click="setLocale(l)"
                        >
                            {{ labelFor(l) }}
                        </button>
                    </li>
                </ul>
            </template>
        </LocalePicker>
    </header>

    <main :lang="locale.replace(/_/g, '-')">
        <h1>Welcome</h1>
        <p>Current locale: <code>{{ locale }}</code></p>
    </main>
</template>

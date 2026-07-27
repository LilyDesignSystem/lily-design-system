<!--
    NHS UK-style language banner.

    Mirrors the NHS UK Design System's pattern of placing a language
    chooser in a top utility banner. The banner keeps the
    `locale-chooser` class hook so consumer CSS can target it without
    duplication.

    Since the icon-button rewrite the control is a globe button that
    opens a listbox, which suits a utility banner better than the old
    inline button row: it costs one glyph of horizontal space no matter
    how many languages you support. Endonyms still do the work — they
    live in `localeLabels`, so each option renders in its own script,
    and each <li role="option"> carries its own `lang` automatically.

    Outcome: a <header> banner with a compact globe button. Opening it
    lists "English", "Cymraeg", "Gàidhlig", "اردو", "繁體中文", … each
    pronounced in its own language.
-->
<script setup lang="ts">
import { ref } from "vue";
import LocaleChooser from "../LocaleChooser.vue";

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

        <LocaleChooser
            label="Language"
            :locales="[
                'en', 'cy', 'gd', 'ga',
                'fr', 'pl', 'ur', 'bn', 'zh_Hant',
            ]"
            :locale-labels="NATIVE"
            v-model:value="locale"
            storage-key="nhs-locale"
            class="utility-banner-languages"
        />

        <!--
            The closed button shows only a glyph, so surface the active
            language in text as well. `lang` on the name keeps the
            endonym pronounced correctly (WCAG 3.1.2).
        -->
        <p class="locale-chooser-status" aria-live="polite">
            Language:
            <span :lang="locale.replace(/_/g, '-')">{{
                NATIVE[locale] ?? locale
            }}</span>
        </p>
    </header>

    <main :lang="locale.replace(/_/g, '-')">
        <h1>Welcome</h1>
        <p>Current locale: <code>{{ locale }}</code></p>
    </main>
</template>

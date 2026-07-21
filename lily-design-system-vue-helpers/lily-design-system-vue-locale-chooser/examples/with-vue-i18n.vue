<!--
    Wiring vue-i18n (Intlify).

    The select's bindable `value` is mirrored into vue-i18n's `locale`
    ref via the `change` event. Every `$t("key")` / `t("key")` call
    in your templates re-evaluates automatically when the user picks a
    different locale.

    Prerequisites:
        pnpm add vue-i18n
        // src/i18n.ts
        // import { createI18n } from "vue-i18n";
        // export default createI18n({
        //     legacy: false,
        //     locale: "en",
        //     fallbackLocale: "en",
        //     messages: {
        //         en: { greeting: "Hello" },
        //         fr: { greeting: "Bonjour" },
        //         ar: { greeting: "مرحبا" },
        //     },
        // });
        // src/main.ts
        // app.use(i18n);

    Outcome: choosing a locale flips vue-i18n's runtime locale and
    every t("…") binding re-renders.
-->
<script setup lang="ts">
import { ref } from "vue";
// import { useI18n } from "vue-i18n";
import LocaleChooser from "../LocaleChooser.vue";

// Demo-only stand-ins so this file compiles without vue-i18n installed.
const _locale = ref("en");
function useI18n() {
    return {
        locale: _locale,
        t: (key: string) =>
            ({
                "home.heading": "Hello",
                "home.body": "This page is rendered through vue-i18n.",
            })[key] ?? key,
    };
}

const { locale: i18nLocale, t } = useI18n();
const current = ref<string>(i18nLocale.value);

function onLocaleChange(code: string) {
    i18nLocale.value = code;
}
</script>

<template>
    <LocaleChooser
        label="Language"
        :locales="['en', 'fr', 'ar']"
        :locale-labels="{ en: 'English', fr: 'Français', ar: 'العربية' }"
        v-model:value="current"
        storage-key="app-locale"
        detect-from-navigator
        @change="onLocaleChange"
    />

    <h1>{{ t("home.heading") }}</h1>
    <p>{{ t("home.body") }}</p>
</template>

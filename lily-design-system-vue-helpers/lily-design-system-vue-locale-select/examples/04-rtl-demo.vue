<!--
    04. RTL demo — Arabic, Hebrew, Persian, Urdu, Pashto.

    Visualises the picker's auto-detection in action. Switching to any
    of the RTL locales writes `dir="rtl"` to <html> and the entire
    page mirrors. Switching back to English restores LTR.

    Outcome: live preview pane reflects current lang and dir.
-->
<script setup lang="ts">
import { ref, computed } from "vue";
import LocaleSelect, {
    isRtlLocale,
    bcp47LocaleTag,
} from "../LocaleSelect.vue";

const locale = ref("en");

// Endonyms — names of each language *in that language*.
const NATIVE: Record<string, string> = {
    en: "English",
    ar: "العربية",
    he: "עברית",
    fa: "فارسی",
    ur: "اردو",
    ps: "پښتو",
};

const sample: Record<string, string> = {
    en: "The quick brown fox jumps over the lazy dog.",
    ar: "نص تجريبي يقرأ من اليمين إلى اليسار.",
    he: "טקסט לדוגמה הנקרא מימין לשמאל.",
    fa: "متن نمونه‌ای که از راست به چپ خوانده می‌شود.",
    ur: "نمونہ متن جو دائیں سے بائیں پڑھا جاتا ہے۔",
    ps: "د ښي خوا څخه کیڼ خوا ته د نمونې متن.",
};

const direction = computed(() =>
    isRtlLocale(locale.value) ? "rtl" : "ltr",
);
const tag = computed(() => bcp47LocaleTag(locale.value));
</script>

<template>
    <LocaleSelect
        label="Direction demo"
        :locales="['en', 'ar', 'he', 'fa', 'ur', 'ps']"
        :locale-labels="NATIVE"
        v-model:value="locale"
    />

    <section :lang="tag" :dir="direction">
        <h2>{{ NATIVE[locale] }}</h2>
        <p>{{ sample[locale] }}</p>
        <p>
            <strong>Detected direction:</strong>
            <code>{{ direction }}</code>
        </p>
        <p>
            <strong>BCP 47 tag:</strong>
            <code>{{ tag }}</code>
        </p>
    </section>
</template>

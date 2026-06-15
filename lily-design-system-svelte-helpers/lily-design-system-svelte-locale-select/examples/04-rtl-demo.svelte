<!--
    04. RTL demo — Arabic, Hebrew, Persian, Urdu.

    Visualises the picker's auto-detection in action. Switching to any
    of the four RTL locales writes `dir="rtl"` to <html> and the entire
    page mirrors. Switching back to English restores LTR.

    Outcome: live preview pane reflects current lang and dir.
-->
<script lang="ts">
    import LocaleSelect, { isRtlLocale, bcp47LocaleTag } from "../LocaleSelect.svelte";

    let locale = $state("en");

    // CLDR-style names of each language *in that language*.
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
</script>

<LocaleSelect
    label="Direction demo"
    locales={["en", "ar", "he", "fa", "ur", "ps"]}
    localeLabels={NATIVE}
    bind:value={locale}
/>

<section lang={bcp47LocaleTag(locale)} dir={isRtlLocale(locale) ? "rtl" : "ltr"}>
    <h2>{NATIVE[locale]}</h2>
    <p>{sample[locale]}</p>
    <p>
        <strong>Detected direction:</strong>
        <code>{isRtlLocale(locale) ? "rtl" : "ltr"}</code>
    </p>
    <p>
        <strong>BCP 47 tag:</strong>
        <code>{bcp47LocaleTag(locale)}</code>
    </p>
</section>

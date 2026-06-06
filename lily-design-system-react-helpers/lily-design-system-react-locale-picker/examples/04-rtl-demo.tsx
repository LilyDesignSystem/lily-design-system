"use client";

/*
    04. RTL demo — Arabic, Hebrew, Persian, Urdu.

    Visualises the picker's auto-detection in action. Switching to any
    of the four RTL locales writes `dir="rtl"` to <html> and the entire
    page mirrors. Switching back to English restores LTR.

    Outcome: live preview pane reflects current lang and dir.
*/

import { useState } from "react";
import {
    LocalePicker,
    isRtlLocale,
    bcp47LocaleTag,
} from "../LocalePicker";

// CLDR-style names of each language *in that language*.
const NATIVE: Record<string, string> = {
    en: "English",
    ar: "العربية",
    he: "עברית",
    fa: "فارسی",
    ur: "اردو",
    ps: "پښتو",
};

const SAMPLE: Record<string, string> = {
    en: "The quick brown fox jumps over the lazy dog.",
    ar: "نص تجريبي يقرأ من اليمين إلى اليسار.",
    he: "טקסט לדוגמה הנקרא מימין לשמאל.",
    fa: "متن نمونه‌ای که از راست به چپ خوانده می‌شود.",
    ur: "نمونہ متن جو دائیں سے بائیں پڑھا جاتا ہے۔",
    ps: "د ښي خوا څخه کیڼ خوا ته د نمونې متن.",
};

export function RtlDemoExample() {
    const [locale, setLocale] = useState("en");
    const dir = isRtlLocale(locale) ? "rtl" : "ltr";
    const tag = bcp47LocaleTag(locale);

    return (
        <>
            <LocalePicker
                label="Direction demo"
                locales={["en", "ar", "he", "fa", "ur", "ps"]}
                localeLabels={NATIVE}
                value={locale}
                onChange={setLocale}
            />

            <section lang={tag} dir={dir}>
                <h2>{NATIVE[locale]}</h2>
                <p>{SAMPLE[locale]}</p>
                <p>
                    <strong>Detected direction:</strong>{" "}
                    <code>{dir}</code>
                </p>
                <p>
                    <strong>BCP 47 tag:</strong>{" "}
                    <code>{tag}</code>
                </p>
            </section>
        </>
    );
}

export default RtlDemoExample;

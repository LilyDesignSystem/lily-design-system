"use client";

/*
    07. Wiring react-i18next.

    react-i18next exposes a `useTranslation()` hook returning `t` (the
    translator) and `i18n` (the runtime). The picker's `onChange` calls
    `i18n.changeLanguage(code)`. Subscribed components re-render
    automatically.

    Prerequisites:
        pnpm add i18next react-i18next
        // i18n.ts:
        //   import i18n from "i18next";
        //   import { initReactI18next } from "react-i18next";
        //   i18n.use(initReactI18next).init({
        //       resources: { en: { translation: {...} }, fr: {...}, ar: {...} },
        //       lng: "en",
        //       fallbackLng: "en",
        //       interpolation: { escapeValue: false },
        //   });

    Outcome: choosing a locale calls i18n.changeLanguage, every t() in
    the tree re-renders, and lang/dir on <html> updates.
*/

import { useState } from "react";
import { LocalePicker } from "../LocalePicker";

// Demo-only stand-ins so this file compiles without react-i18next installed.
// In your real app, replace these with:
//   import { useTranslation } from "react-i18next";
type UseTranslationResult = {
    t: (key: string) => string;
    i18n: {
        resolvedLanguage: string;
        changeLanguage: (code: string) => Promise<unknown>;
    };
};

function useFakeTranslation(): UseTranslationResult {
    const [current, setCurrent] = useState("en");
    const messages: Record<string, Record<string, string>> = {
        en: { "home.heading": "Welcome", "home.body": "This is English." },
        fr: { "home.heading": "Bienvenue", "home.body": "C'est en français." },
        ar: { "home.heading": "أهلاً وسهلاً", "home.body": "هذا بالعربية." },
    };
    return {
        t: (k) => messages[current]?.[k] ?? k,
        i18n: {
            resolvedLanguage: current,
            changeLanguage: (c) => {
                setCurrent(c);
                return Promise.resolve();
            },
        },
    };
}

export function WithReactI18nextExample() {
    // In your app: const { t, i18n } = useTranslation();
    const { t, i18n } = useFakeTranslation();

    return (
        <>
            <LocalePicker
                label="Language"
                locales={["en", "fr", "ar"]}
                value={i18n.resolvedLanguage}
                onChange={(code) => {
                    void i18n.changeLanguage(code);
                }}
                storageKey="i18next-locale"
            />

            <h1>{t("home.heading")}</h1>
            <p>{t("home.body")}</p>
        </>
    );
}

export default WithReactI18nextExample;

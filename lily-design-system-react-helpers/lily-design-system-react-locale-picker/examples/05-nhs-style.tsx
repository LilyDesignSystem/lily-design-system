"use client";

/*
    05. NHS UK-style language banner.

    Mirrors the NHS UK Design System's pattern of placing a language
    chooser in a top utility banner. The banner uses native button-group
    markup but with the `locale-picker` class hook so consumer CSS can
    target it without duplication.

    Outcome: a <header> banner with the picker rendered as a horizontal
    button list. Each entry shows the language in its own script.
*/

import { useState } from "react";
import { LocalePicker } from "../LocalePicker";

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

export function NhsStyleExample() {
    const [locale, setLocale] = useState("en");

    return (
        <>
            <header className="utility-banner" aria-label="Site utilities">
                <span>NHS</span>

                <LocalePicker
                    label="Language"
                    locales={[
                        "en", "cy", "gd", "ga", "fr",
                        "pl", "ur", "bn", "zh_Hant",
                    ]}
                    localeLabels={NATIVE}
                    value={locale}
                    onChange={setLocale}
                    storageKey="nhs-locale"
                    className="utility-banner-languages"
                >
                    {({ locales, value, setLocale: pick, labelFor, tagFor }) => (
                        <ul className="locale-picker-list" role="list">
                            {locales.map((l) => (
                                <li key={l}>
                                    <button
                                        type="button"
                                        aria-pressed={value === l}
                                        lang={tagFor(l)}
                                        onClick={() => pick(l)}
                                    >
                                        {labelFor(l)}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </LocalePicker>
            </header>

            <main lang={locale.replace(/_/g, "-")}>
                <h1>Welcome</h1>
                <p>
                    Current locale: <code>{locale}</code>
                </p>
            </main>
        </>
    );
}

export default NhsStyleExample;

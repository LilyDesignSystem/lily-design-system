"use client";

/*
    NHS UK-style language banner.

    Mirrors the NHS UK Design System's pattern of placing a language
    picker in a top utility banner. The control keeps its own icon
    button + listbox markup; the banner just supplies the `className`
    hook so consumer CSS can position it.

    The `children` render prop replaces the button icon. Here we keep
    the globe outline SVG but pair it with the active language's
    endonym, so the closed control still tells the reader which
    language is active — the accessibility tradeoff of an icon-only
    button (see docs/accessibility.md).

    Outcome: a <header> banner with a globe-icon "English" button that
    opens the language listbox.
*/

import { useState } from "react";
import { LocalePicker } from "../LocalePicker";

// Mirrors LocalePicker's own default icon (reversed 2026-09-16 from
// the Unicode glyph U+1F310); no longer exported as a constant.
function GlobeIcon() {
    return (
        <svg
            viewBox="0 0 16 16"
            width="1.05rem"
            height="1.05rem"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="8" cy="8" r="6" />
            <path d="M2 8h12" />
            <path d="M8 2c2.2 0 4 2.7 4 6s-1.8 6-4 6-4-2.7-4-6 1.8-6 4-6z" />
        </svg>
    );
}

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
                    {({ value, labelFor }) => (
                        // aria-hidden: the button is already named by the
                        // `label` prop; this is redundant visual detail.
                        <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "center", gap: "0.25em" }}>
                            <GlobeIcon /> {labelFor(value)}
                        </span>
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

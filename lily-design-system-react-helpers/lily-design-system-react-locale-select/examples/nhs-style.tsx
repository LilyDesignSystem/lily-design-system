"use client";

/*
    NHS UK-style language banner.

    Mirrors the NHS UK Design System's pattern of placing a language
    chooser in a top utility banner. The control keeps its own icon
    button + listbox markup; the banner just supplies the `className`
    hook so consumer CSS can position it.

    The `children` render prop replaces the button glyph. Here we keep
    the globe but pair it with the active language's endonym, so the
    closed control still tells the reader which language is active —
    the accessibility tradeoff of an icon-only button (see
    docs/accessibility.md).

    Outcome: a <header> banner with a "🌐 English" button that opens the
    language listbox.
*/

import { useState } from "react";
import { LocaleSelect, GLOBE_WITH_MERIDIANS } from "../LocaleSelect";

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

                <LocaleSelect
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
                        <span aria-hidden="true">
                            {GLOBE_WITH_MERIDIANS} {labelFor(value)}
                        </span>
                    )}
                </LocaleSelect>
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

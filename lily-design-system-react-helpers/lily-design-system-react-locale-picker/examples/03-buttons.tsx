"use client";

/*
    03. Toggle-button group via the children render prop.

    A button group renders the locales inline with `aria-pressed` to
    indicate the active locale. Use it when you want a more prominent,
    tap-friendly affordance than a radio group on small screens, or
    when you want to render flags / abbreviations.

    Outcome: a horizontal <ul> of <button>s. The picker still drives
    lang/dir/onChange.
*/

import { useState } from "react";
import { LocalePicker } from "../LocalePicker";

// Short two-letter codes for compact display.
const SHORT: Record<string, string> = {
    en: "EN",
    fr: "FR",
    es: "ES",
    de: "DE",
    ar: "ع",
    he: "ע",
};

export function ButtonsExample() {
    const [locale, setLocale] = useState("en");

    return (
        <>
            <LocalePicker
                label="Language"
                locales={["en", "fr", "es", "de", "ar", "he"]}
                value={locale}
                onChange={setLocale}
            >
                {({ locales, value, setLocale: pick, labelFor, tagFor, isRtl }) => (
                    <ul className="locale-picker-list" role="list">
                        {locales.map((l) => (
                            <li key={l}>
                                <button
                                    type="button"
                                    aria-pressed={value === l}
                                    lang={tagFor(l)}
                                    dir={isRtl(l) ? "rtl" : "ltr"}
                                    title={labelFor(l)}
                                    onClick={() => pick(l)}
                                >
                                    {SHORT[l] ?? l.toUpperCase()}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </LocalePicker>

            <p>
                Selected: <code>{locale}</code>
            </p>
        </>
    );
}

export default ButtonsExample;

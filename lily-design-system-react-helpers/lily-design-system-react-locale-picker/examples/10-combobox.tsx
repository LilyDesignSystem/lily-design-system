"use client";

/*
    10. Combobox with native <datalist> type-ahead.

    For long locale lists (50+) where a radio group is impractical and
    a `<select>` is too tedious to scroll. Uses an `<input list>` +
    `<datalist>` for native, accessible type-ahead. The picker
    validates the typed value against the supported set before applying.

    Outcome: type "Fr" — the combobox shows "Français", "Français
    (Canada)", "Frisian", etc. Pick one and the picker applies.

    Browser support note: native <datalist> is widely supported but
    iOS Safari's UX is limited. For a fully APG-compliant combobox,
    swap in a Lily headless Combobox primitive or Radix UI's Combobox.
*/

import { useState } from "react";
import { LocalePicker, defaultLocaleLabels } from "../LocalePicker";

// All 436 locale codes from the built-in table.
const ALL_LOCALES = Object.keys(defaultLocaleLabels);

export function ComboboxExample() {
    const [locale, setLocale] = useState("en");
    const [inputValue, setInputValue] = useState("");

    return (
        <>
            <LocalePicker
                label="Language"
                locales={ALL_LOCALES}
                value={locale}
                onChange={setLocale}
                storageKey="combobox-locale"
            >
                {({ locales, value, setLocale: pick, labelFor, tagFor }) => (
                    <>
                        <input
                            type="text"
                            list="locale-options"
                            placeholder="Start typing a language…"
                            aria-label="Language"
                            value={inputValue || labelFor(value)}
                            onChange={(e) => setInputValue(e.currentTarget.value)}
                            onBlur={(e) => {
                                const typed = e.currentTarget.value;
                                // Find the locale whose label matches the typed text.
                                const match = locales.find(
                                    (l) =>
                                        labelFor(l).toLowerCase() ===
                                        typed.toLowerCase(),
                                );
                                if (match) {
                                    pick(match);
                                    setInputValue("");
                                }
                            }}
                        />
                        <datalist id="locale-options">
                            {locales.map((l) => (
                                <option key={l} value={labelFor(l)} lang={tagFor(l)}>
                                    {l}
                                </option>
                            ))}
                        </datalist>
                    </>
                )}
            </LocalePicker>

            <p>
                Selected locale: <code>{locale}</code> ({defaultLocaleLabels[locale]})
            </p>
        </>
    );
}

export default ComboboxExample;

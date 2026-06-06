"use client";

/*
    02. Native <select> via the children render prop.

    The picker still owns the lifecycle (lang/dir/storage/onChange) but
    delegates the markup to a <select>. Best for >~12 locales or when
    the design system uses dropdowns for setting controls.

    Outcome: a single <select> populated with one <option> per locale,
    each carrying its own BCP 47 `lang`. The picker's useEffect runs the
    same way as the default rendering.
*/

import { useState } from "react";
import { LocalePicker } from "../LocalePicker";

const LONG_LIST = [
    "en", "en_US", "en_GB",
    "fr", "fr_CA",
    "es", "es_419",
    "de",
    "zh_Hans", "zh_Hant",
    "ja", "ko",
    "ar", "he", "fa", "ur",
    "hi", "bn",
    "pt", "pt_BR",
    "ru", "tr", "vi",
];

export function SelectExample() {
    const [locale, setLocale] = useState("en");

    return (
        <>
            <LocalePicker
                label="Language"
                locales={LONG_LIST}
                value={locale}
                onChange={setLocale}
                storageKey="app-locale"
                detectFromNavigator
            >
                {({ locales, value, setLocale: pick, labelFor, tagFor }) => (
                    <select
                        className="locale-picker-select"
                        aria-label="Language"
                        value={value}
                        onChange={(e) => pick(e.currentTarget.value)}
                    >
                        {locales.map((l) => (
                            <option key={l} value={l} lang={tagFor(l)}>
                                {labelFor(l)}
                            </option>
                        ))}
                    </select>
                )}
            </LocalePicker>

            <p>
                Selected locale: <code>{locale}</code>
            </p>
        </>
    );
}

export default SelectExample;

"use client";

/*
    02. Custom <select> via the children render prop.

    The default rendering is already a <select>; this example shows how
    to take full control of the <select> markup via the children render
    prop while the select still owns the lifecycle
    (lang/dir/storage/onChange). Use it when you need a custom class,
    extra attributes, or grouped <optgroup> structure for a long list.

    Outcome: a single <select> populated with one <option> per locale,
    each carrying its own BCP 47 `lang`. The select's useEffect runs the
    same way as the default rendering.
*/

import { useState } from "react";
import { LocaleSelect } from "../LocaleSelect";

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
            <LocaleSelect
                label="Language"
                locales={LONG_LIST}
                value={locale}
                onChange={setLocale}
                storageKey="app-locale"
                detectFromNavigator
            >
                {({ locales, value, setLocale: pick, labelFor, tagFor }) => (
                    <select
                        className="locale-select-select"
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
            </LocaleSelect>

            <p>
                Selected locale: <code>{locale}</code>
            </p>
        </>
    );
}

export default SelectExample;

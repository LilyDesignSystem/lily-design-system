"use client";

/*
    Custom button content via the children render prop.

    The control renders an icon button that opens a listbox. By default
    the button holds a globe glyph (U+1F310). The `children` render prop
    REPLACES that glyph — it no longer renders the options, which the
    component now owns.

    The render prop receives:
      - value:    the active locale code (consumer form, e.g. "en_US")
      - open:     is the listbox expanded?
      - labelFor: resolve a code to its display label

    Below, the button shows the active locale's short code instead of a
    globe, which is useful when the control sits in a dense toolbar and
    you want the current language visible without opening the listbox.

    Outcome: a button reading "EN" / "FR" that opens the same listbox.
*/

import { useState } from "react";
import { LocaleChooser } from "../LocaleChooser";

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
            <LocaleChooser
                label="Language"
                locales={LONG_LIST}
                value={locale}
                onChange={setLocale}
                storageKey="app-locale"
                detectFromNavigator
            >
                {({ value, open, labelFor }) => (
                    <>
                        {/*
                            aria-hidden: the button's accessible name comes
                            from the `label` prop via aria-label, so this
                            visual shorthand must not be announced twice.
                        */}
                        <span aria-hidden="true" title={labelFor(value)}>
                            {value.split("_")[0].toUpperCase()}
                        </span>
                        <span aria-hidden="true">{open ? "▴" : "▾"}</span>
                    </>
                )}
            </LocaleChooser>

            <p>
                Selected locale: <code>{locale}</code>
            </p>
        </>
    );
}

export default SelectExample;

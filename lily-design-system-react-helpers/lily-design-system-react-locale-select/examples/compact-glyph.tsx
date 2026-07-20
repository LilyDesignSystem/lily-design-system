"use client";

/*
    Flag-style glyph button via the children render prop.

    A compact, tap-friendly affordance for small screens: the button
    shows a short code (or a flag-ish endonym abbreviation) rather than
    the default globe. The listbox itself is unchanged — the component
    owns the options, the keyboard contract, and the lifecycle.

    The render prop receives `{ value, open, labelFor }`. It replaces the
    glyph INSIDE the button; it does not render options.

    Outcome: a single button reading "EN" / "FR" / "ع" that opens the
    listbox. The component still drives lang/dir/onChange.
*/

import { useState } from "react";
import { LocaleSelect } from "../LocaleSelect";

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
            <LocaleSelect
                label="Language"
                locales={["en", "fr", "es", "de", "ar", "he"]}
                value={locale}
                onChange={setLocale}
            >
                {({ value, labelFor }) => (
                    // aria-hidden: the accessible name is the `label`
                    // prop, applied to the button as aria-label.
                    <span aria-hidden="true" title={labelFor(value)}>
                        {SHORT[value] ?? value.toUpperCase()}
                    </span>
                )}
            </LocaleSelect>

            <p>
                Selected: <code>{locale}</code>
            </p>
        </>
    );
}

export default ButtonsExample;

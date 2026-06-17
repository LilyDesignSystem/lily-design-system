"use client";

/*
    01. Default <select> rendering.

    The simplest possible mount. Each <option> renders with its locale's
    pretty name (from the built-in `locales.tsv` table) and carries its
    own `lang="…"` so screen readers pronounce each in the right
    language.

    Outcome: a <select> with three options. Picking one writes
    `<html lang="…" dir="…">` and updates the controlled `value`.
*/

import { useState } from "react";
import { LocaleSelect } from "../LocaleSelect";

export function SelectDefaultExample() {
    const [locale, setLocale] = useState("en");

    return (
        <>
            <LocaleSelect
                label="Choose your language"
                locales={["en", "fr", "ar"]}
                value={locale}
                onChange={setLocale}
            />

            <p>
                Selected locale: <code>{locale}</code>
            </p>
        </>
    );
}

export default SelectDefaultExample;

"use client";

/*
    01. Default radio group.

    The simplest possible mount. Each radio renders with its locale's
    pretty name (from the built-in `locales.tsv` table), wrapped in a
    `<label lang="…">` so screen readers pronounce each in the right
    language.

    Outcome: a fieldset with three radios. Picking one writes
    `<html lang="…" dir="…">` and updates the controlled `value`.
*/

import { useState } from "react";
import { LocalePicker } from "../LocalePicker";

export function RadiosExample() {
    const [locale, setLocale] = useState("en");

    return (
        <>
            <LocalePicker
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

export default RadiosExample;

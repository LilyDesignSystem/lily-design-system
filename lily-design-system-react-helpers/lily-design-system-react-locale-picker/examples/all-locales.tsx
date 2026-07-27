"use client";

/*
    Very long locale lists.

    For long lists (50+) the built-in listbox already provides APG
    typeahead: open it and start typing a label prefix to jump. This
    example feeds the control all 436 codes from the built-in table and
    leans on that typeahead rather than adding a separate widget.

    Note: the `children` render prop can no longer supply a different
    control — it replaces the glyph inside the button only. If you truly
    need an editable combobox (free-text filtering over hundreds of
    entries), build it from a Lily headless Combobox primitive and call
    the exported pure helpers (`bcp47LocaleTag`, `isRtlLocale`,
    `matchNavigatorLanguage`) to reuse this package's logic.

    Outcome: an icon button whose listbox holds every known locale;
    typing "fr" while it is open jumps to "French".
*/

import { useState } from "react";
import { LocaleChooser, defaultLocaleLabels } from "../LocaleChooser";

// All 436 locale codes from the built-in table.
const ALL_LOCALES = Object.keys(defaultLocaleLabels);

export function ComboboxExample() {
    const [locale, setLocale] = useState("en");

    return (
        <>
            <LocaleChooser
                label="Language"
                locales={ALL_LOCALES}
                value={locale}
                onChange={setLocale}
                storageKey="combobox-locale"
            >
                {({ value, open, labelFor }) => (
                    <>
                        <span aria-hidden="true">{labelFor(value)}</span>
                        <span aria-hidden="true">{open ? "▴" : "▾"}</span>
                    </>
                )}
            </LocaleChooser>

            <p>
                Selected locale: <code>{locale}</code> ({defaultLocaleLabels[locale]})
            </p>
        </>
    );
}

export default ComboboxExample;

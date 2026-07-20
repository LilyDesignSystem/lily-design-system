"use client";

/*
    01. Default <select> rendering.

    The simplest possible mount. Each <option> renders with its locale's
    pretty name (from the built-in `locales.tsv` table) and carries its
    own `lang="…"` so screen readers pronounce each in the right
    language.

    Outcome: a <select> with three options. Picking one writes
    `<html lang="…" dir="…">` and updates the controlled `value`.

    The status line is part of the basic pattern, not an add-on.
    ------------------------------------------------------------------
    The closed <select> is placeholder-pinned: it always reads the
    placeholder word, never "Français". That keeps the control one word
    wide, but it means a screen-reader user never hears the active
    locale announced as the combobox value. The
    <p className="locale-select-status"> below is the compensating
    channel, and it is the default pattern this package ships — see
    ../docs/accessibility.md.

    Three details worth copying verbatim:

    - It is VISIBLE, not sr-only. Sighted users benefit too: the active
      locale is otherwise invisible once the control snaps back to the
      placeholder, which matters for cognitive accessibility. If your
      design genuinely cannot spare the line, keep the element and hide
      it with a visually-hidden class rather than deleting it.

    - aria-live="polite" announces MUTATIONS only, so this stays silent
      on first paint and speaks once on each subsequent change. That is
      the intended behaviour: no announcement on page load, one polite
      announcement per user action, and no focus movement.

    - localeName() is exported by this package — use it rather than
      showing the raw code, so the line reads "Active language: French"
      instead of "Active language: fr".
*/

import { useState } from "react";
import { LocaleSelect, localeName } from "../LocaleSelect";

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

            <p className="locale-select-status" aria-live="polite">
                Active language: {localeName(locale)}
            </p>
        </>
    );
}

export default SelectDefaultExample;

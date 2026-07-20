"use client";

/*
    Default rendering.

    The simplest possible mount. Each option renders with its locale's
    pretty name (from the built-in `locales.tsv` table) and carries its
    own `lang="…"` so screen readers pronounce each in the right
    language.

    Outcome: an icon button (the globe glyph, U+1F310) that opens a
    <ul class="locale-select-list" role="listbox"> with three
    <li role="option"> entries. Picking one writes
    `<html lang="…" dir="…">` and updates the controlled `value`.

    The status line is part of the basic pattern, not an add-on.
    ------------------------------------------------------------------
    The closed control shows only a glyph: it never reads "Français".
    That keeps the control one icon wide, but it means neither a sighted
    user nor a screen-reader user learns the active language without
    opening the listbox. The
    <p className="locale-select-status"> below is the compensating
    channel, and it is the default pattern this package ships — see
    ../docs/accessibility.md.

    Three details worth copying verbatim:

    - It is VISIBLE, not sr-only. Sighted users benefit too: the active
      locale is otherwise invisible while the listbox is closed, which
      matters for cognitive accessibility. If your design genuinely
      cannot spare the line, keep the element and hide it with a
      visually-hidden class rather than deleting it. (The other option
      is to pass a `children` render prop that shows the active label
      inside the button — see ./nhs-style.tsx.)

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

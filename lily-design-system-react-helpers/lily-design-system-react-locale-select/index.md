# LocaleSelect (React helper)

A reusable, headless React 19 locale select that applies the chosen
locale to the document root via `lang` and `dir`, with optional
`localStorage` persistence and `navigator.languages` detection.

For the full contract see [spec/index.md](./spec/index.md) — it is the single
source of truth for the API, behaviour, and tests.

## Install

This directory is published as a folder-style import; consumers either
copy it into their project or wire it as a workspace dependency. The
only runtime dependency is `react` ≥ 19.

```ts
import {
    LocaleSelect,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    type Props,
    type ChildArgs,
} from "./lily-design-system-react-locale-select";
```

## Quick start

Render the select with a `label` and the list of locales your app
supports. The select writes `lang` and `dir` onto `<html>` so your
i18n library, your CSS (`html[dir="rtl"]`), and assistive technology
all see the change.

```tsx
"use client";

import { useState } from "react";
import {
    LocaleSelect,
    localeName,
} from "./lily-design-system-react-locale-select";

export function LanguageChooser() {
    const [locale, setLocale] = useState("");
    return (
        <>
            <LocaleSelect
                label="Language"
                locales={["en", "en_US", "fr", "fr_CA", "ar", "he"]}
                value={locale}
                onChange={setLocale}
                storageKey="lily-locale"
                detectFromNavigator
            />

            <p className="locale-select-status" aria-live="polite">
                Active language: {localeName(locale)}
            </p>
        </>
    );
}
```

The status line is part of the pattern, not an optional extra. The
closed control is placeholder-pinned — it always reads "Language",
never "Français" — so without this line the active locale is announced
to nobody and shown to nobody. `aria-live="polite"` announces mutations
only, so it stays quiet on first paint and speaks once per user change,
and `localeName()` turns the code into a human name. Keep it visible
where you can (it helps sighted and cognitively-loaded users too); if
your design cannot spare the space, hide it with a visually-hidden
class rather than dropping it — see
[docs/accessibility.md](./docs/accessibility.md) for the full
rationale and its limits.

When the user picks `ar`, the component:

- sets `lang="ar"` on `<html>`,
- sets `dir="rtl"` on `<html>` (auto-detected from the locale),
- writes `"ar"` to `localStorage["lily-locale"]`,
- fires `onChange("ar")` if provided.

The select does NOT translate strings — that is the consumer's i18n
library (e.g. `react-intl`, `react-i18next`, Paraglide, Inlang, Tolgee,
raw `Intl.*`). Wire the controlled `value` or `onChange` to your
library so it loads the right messages.

## BCP 47 normalisation

Language tags follow **BCP 47** (RFC 5646). The `lang` attribute on
HTML elements must use hyphens, while many applications carry locale
identifiers with underscores (`en_US`, `zh_Hant_TW`). The select
accepts whichever form you prefer in the `locales` array and converts
to the hyphen form when writing to the DOM. The controlled `value`
preserves your original form, so round-trips are lossless.

```ts
bcp47LocaleTag("en_US");      // "en-US"
bcp47LocaleTag("zh_Hant_TW"); // "zh-Hant-TW"
bcp47LocaleTag("en");         // "en"
```

References:

- W3C — [Language tags in HTML and XML](https://www.w3.org/International/articles/language-tags/)
- IETF — [RFC 5646 (BCP 47), Tags for Identifying Languages](https://www.rfc-editor.org/rfc/rfc5646)
- IANA — [Language Subtag Registry](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry)

## RTL auto-detection

`isRtlLocale(locale)` returns `true` for any locale whose base
language is one of `ar`, `arc`, `ckb`, `dv`, `fa`, `he`, `iw`, `ji`,
`ks`, `ku`, `mzn`, `ps`, `sd`, `ug`, `ur`, `yi`, OR whose script
subtag is one of `Arab`, `Hebr`, `Thaa`, `Syrc`, `Nkoo`, `Mong`,
`Adlm`.

```ts
isRtlLocale("ar");         // true
isRtlLocale("he_IL");      // true
isRtlLocale("uz_Arab_AF"); // true (script subtag)
isRtlLocale("en");         // false
```

Pass `applyDir={false}` if you want full control of `dir` yourself.

## Examples

### Default `<select>` with NHS-style markup

```tsx
"use client";

import { useState } from "react";
import { LocaleSelect } from "./lily-design-system-react-locale-select";

export function NhsBanner() {
    const [locale, setLocale] = useState("en");
    return (
        <LocaleSelect
            label="Language"
            locales={["en", "cy"]}
            value={locale}
            onChange={setLocale}
        />
    );
}

// Renders:
// <select class="locale-select" aria-label="Language" name="locale">
//     <option class="locale-select-option locale-select-placeholder" value="">Language</option>
//     <option class="locale-select-option" value="en" lang="en">English</option>
//     <option class="locale-select-option" value="cy" lang="cy">Welsh</option>
// </select>
```

Each locale option carries its own `lang` attribute so a screen reader
pronounces "Cymraeg" with a Welsh voice (WCAG 3.1.2, Language of
Parts). The leading placeholder carries none — it is not a locale.

### The always-shown placeholder

The closed control **always** reads the placeholder option — never the
name of the active locale. After you pick an option the select's own
value snaps straight back to `""`, which keeps the control as narrow as
the placeholder word instead of stretching to the longest locale name.

The real selection is unaffected: it lives in the `value` prop /
internal state, and `lang`, `dir`, persistence, and `onChange` all
behave exactly as before.

Pass `placeholder` to show a shorter word than the accessible name:

```tsx
<LocaleSelect label="Choose a language" placeholder="Locale" locales={["en", "cy"]} />
```

Because the closed control only ever shows that one short word, you can
size it to the word rather than to the longest locale name. The package
ships no CSS; add this to your own stylesheet:

```css
.locale-select {
    field-sizing: content; /* Chrome 123+: size to the shown option */
    width: auto;
    max-width: 12ch; /* fallback for Firefox / Safari */
}
```

The placeholder option is addressable as `.locale-select-placeholder`
(it also carries `.locale-select-option`).

One tradeoff to know: because the control never shows the active
locale, screen-reader users no longer hear it announced as the combobox
value. That is exactly why the quick start above pairs the select with
a `.locale-select-status` live region — pairing them is the default
pattern, and dropping the status line is the deliberate opt-out. See
[docs/accessibility.md](./docs/accessibility.md).

### Styling the status line

This package ships no `docs/styling.md`; the class hooks are
`.locale-select` (root `<select>`), `.locale-select-option`,
`.locale-select-placeholder`, and `.locale-select-status` (the
consumer-rendered status line — you render it, and the examples always
do). Style the status line as ordinary body copy:

```css
.locale-select-status {
    margin-block-start: 0.5rem;
    font-size: 0.875rem;
}
```

Prefer it visible. When a design genuinely cannot spare the space,
**hide the element rather than removing it**, so the live region still
announces:

```css
.locale-select-status {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    overflow: hidden;
    white-space: nowrap;
    clip-path: inset(50%);
}
```

Do not use `display: none` or `visibility: hidden` — both drop the
element from the accessibility tree, silencing the live region and
losing the compensation entirely.

### Pretty labels for the option text

By default the select uses the English names from `locales.tsv` (and
falls back to `Intl.DisplayNames` if available, then to the raw code).
Override per-code with `localeLabels`:

```tsx
<LocaleSelect
    label="Langue"
    locales={["en", "fr", "ar"]}
    localeLabels={{ en: "English", fr: "Français", ar: "العربية" }}
    value={locale}
    onChange={setLocale}
/>
```

Each label is rendered inside a `lang="…"` block so each one is
announced in its own language.

### Driving a custom `<select>`

Use the `children` render prop for full markup control. The select
still owns the apply lifecycle:

```tsx
<LocaleSelect
    label="Language"
    locales={["en", "fr", "es", "de", "ar"]}
    value={locale}
    onChange={setLocale}
    storageKey="lily-locale"
>
    {({ locales, value, setLocale, labelFor, tagFor }) => (
        <select
            aria-label="Language"
            value={value}
            onChange={(e) => setLocale(e.target.value)}
        >
            {locales.map((l) => (
                <option key={l} value={l} lang={tagFor(l)}>
                    {labelFor(l)}
                </option>
            ))}
        </select>
    )}
</LocaleSelect>
```

### Driving a button group

```tsx
<LocaleSelect
    label="Language"
    locales={["en", "fr", "ar"]}
    value={locale}
    onChange={setLocale}
>
    {({ locales, value, setLocale, labelFor, tagFor, isRtl }) => (
        <ul className="locale-select-list">
            {locales.map((l) => (
                <li key={l}>
                    <button
                        type="button"
                        aria-pressed={value === l}
                        lang={tagFor(l)}
                        dir={isRtl(l) ? "rtl" : "ltr"}
                        onClick={() => setLocale(l)}
                    >
                        {labelFor(l)}
                    </button>
                </li>
            ))}
        </ul>
    )}
</LocaleSelect>
```

### Wiring an i18n library

```tsx
"use client";

import { useState } from "react";
import { useIntl } from "react-intl";
import { LocaleSelect } from "./lily-design-system-react-locale-select";

export function LanguageChooser({ onLocaleChange }: { onLocaleChange: (code: string) => void }) {
    const [current, setCurrent] = useState("");
    return (
        <LocaleSelect
            label="Language"
            locales={["en", "fr", "ar"]}
            value={current}
            onChange={(code) => {
                setCurrent(code);
                onLocaleChange(code);     // propagate to react-intl / i18next / …
            }}
            detectFromNavigator
            storageKey="app-locale"
        />
    );
}
```

### Server-resolved initial value (SSR)

For flicker-free first paint, resolve the locale on the server (from
a cookie or `Accept-Language`) and pass it as `value`:

```tsx
"use client";

import { useState } from "react";
import { LocaleSelect } from "./lily-design-system-react-locale-select";

export function LocaleClient({ initialLocale }: { initialLocale: string }) {
    const [locale, setLocale] = useState(initialLocale);
    return (
        <LocaleSelect
            label="Language"
            locales={["en", "fr", "ar"]}
            value={locale}
            onChange={setLocale}
        />
    );
}
```

During SSR the select's parent layout already paints with the correct
`<html lang="…" dir="…">` from the cookie.

### Render into a scoped target instead of `<html>`

Set `target` to a specific element when you want the locale scoped to
a region (e.g. a multilingual side panel):

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { LocaleSelect } from "./lily-design-system-react-locale-select";

export function MultilingualPanel() {
    const ref = useRef<HTMLElement | null>(null);
    const [panelLocale, setPanelLocale] = useState("fr");
    const [, setReady] = useState(false);

    // Force re-render after refs resolve.
    useEffect(() => setReady(true), []);

    return (
        <section ref={ref}>
            <p>This panel switches language independently of the page.</p>
            <LocaleSelect
                label="Panel language"
                locales={["en", "fr", "ar"]}
                target={ref.current}
                value={panelLocale}
                onChange={setPanelLocale}
            />
        </section>
    );
}
```

`<html>` stays in the page's default locale; the section gets the
chosen one.

## Built-in locale data

`locales.ts` ships the 436 codes from `locales.tsv` mapped to their
English names. The component falls back to this table when
`localeLabels` does not have an entry for a code. You can also import
the data directly:

```ts
import {
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
} from "./lily-design-system-react-locale-select";

console.log(defaultLocaleLabels["en_US"]); // "English (United States)"
console.log(RTL_LANGUAGE_TAGS.has("ar"));  // true
```

## Props

See [spec/index.md §4](./spec/index.md#4-public-api) for the full table.

Required props: `label`, `locales`.

Common optional props: `placeholder` (placeholder-option text;
defaults to `label`), `value` (controlled), `defaultValue`,
`storageKey`, `detectFromNavigator`, `localeLabels`, `applyDir`,
`target`, `onChange`, `className`, `name`, `children`.

## Accessibility

- `<select aria-label="…">` (implicit `combobox` role) is the
  announced control.
- The native `<select>` gives Arrow / Home / End / typeahead semantics
  for free (see MDN — `<select>` element).
- Each locale `<option>` carries `lang="…"` so its name is pronounced
  in the right language (WCAG 3.1.2, Language of Parts).
- The document root carries `lang` and (by default) `dir` so the
  page satisfies WCAG 3.1.1 (Language of Page) and bidi text/layout
  inverts correctly for RTL locales.
- No colour-only meaning; the active state is visible in the resolved
  `lang` attribute.
- **Tradeoff:** because the closed control always reads the
  placeholder, the active locale is no longer announced as the
  combobox value. The default pattern compensates with a visible
  `.locale-select-status` live region beside the select — see
  [docs/accessibility.md](./docs/accessibility.md).

## Tests

`pnpm test` under a vitest + jsdom + `@testing-library/react` setup
exercises every numbered acceptance criterion in
[spec/index.md §7](./spec/index.md#7-testing-acceptance-criteria) — 23 numbered
items plus extras for case-insensitive RTL detection and the
navigator-matcher helper.

## Files in this directory

| File                          | Purpose                                          |
| ----------------------------- | ------------------------------------------------ |
| `spec/index.md`                     | Single source of truth — API, behaviour, tests.  |
| `LocaleSelect.tsx`            | The component implementation.                    |
| `LocaleSelect.test.tsx`       | vitest suite covering every spec §7 item.        |
| `locales.ts`                  | Built-in code → English-name map and RTL sets.   |
| `locales.tsv`                 | Canonical 436-row source for `locales.ts`.       |
| `index.ts`                    | Re-export barrel.                                |
| `index.md`                    | This file — quick start + worked examples.       |
| `CHANGELOG.md`                | Per-version history.                             |
| `AGENTS.md`                   | AI-agent metadata pointer.                       |
| `AGENTS/`                     | Per-topic AI-agent guides.                       |
| `CLAUDE.md`                   | Loads `AGENTS.md`.                               |
| `docs/`                       | Deep-dive guides — see [Documentation](#documentation). |
| `examples/`                   | Runnable React 19 example components — see [Examples](#examples). |

## Documentation

| Guide                                                | Covers                                                              |
| ---------------------------------------------------- | ------------------------------------------------------------------- |
| [docs/concepts.md](./docs/concepts.md)               | Mental model, lifecycle diagram, why the defaults are what they are. |
| [docs/bcp47.md](./docs/bcp47.md)                     | Language-tag syntax (RFC 5646), IANA registry, subtag composition.   |
| [docs/rtl.md](./docs/rtl.md)                         | What's auto-detected, what `dir="rtl"` actually changes, CSS tips.   |
| [docs/i18n-integration.md](./docs/i18n-integration.md) | Wiring react-intl, react-i18next, Paraglide, Tolgee, raw `Intl.*`. |
| [docs/ssr.md](./docs/ssr.md)                         | Cookie, URL-prefix, Accept-Language, streaming SSR, FOUC avoidance.  |
| [docs/accessibility.md](./docs/accessibility.md)     | WCAG 2.2 AAA mapping, keyboard contract, screen-reader matrix.       |

## Examples

Each file in `examples/` is a complete, runnable React 19 component
you can copy into your project.

| Example                                                                                 | Demonstrates                                                       |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [01-radios.tsx](./examples/01-radios.tsx)                                               | The default native `<select>` rendering + the default status line. |
| [02-select.tsx](./examples/02-select.tsx)                                               | Custom `<select>` markup via the `children` render prop.           |
| [03-buttons.tsx](./examples/03-buttons.tsx)                                             | Toggle-button group with short codes / glyphs.                     |
| [04-rtl-demo.tsx](./examples/04-rtl-demo.tsx)                                           | Live RTL preview — Arabic, Hebrew, Persian, Urdu, Pashto.          |
| [05-nhs-style.tsx](./examples/05-nhs-style.tsx)                                         | NHS UK-style language banner with endonyms.                        |
| [06-with-react-intl.tsx](./examples/06-with-react-intl.tsx)                             | Binding to react-intl's `locale` prop.                             |
| [07-with-react-i18next.tsx](./examples/07-with-react-i18next.tsx)                       | Driving react-i18next's `changeLanguage()` from `onChange`.        |
| [08-ssr-cookie.tsx](./examples/08-ssr-cookie.tsx)                                       | Next.js App Router cookie-based SSR — no flash of default locale.  |
| [09-scoped-target.tsx](./examples/09-scoped-target.tsx)                                 | Multiple per-region selects, each scoped to its own panel.         |
| [10-combobox.tsx](./examples/10-combobox.tsx)                                           | Native `<datalist>` type-ahead for 436 locales.                    |

---

Lily™ and Lily Design System™ are trademarks.

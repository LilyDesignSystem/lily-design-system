# LocalePicker (React helper)

A reusable, headless React 19 locale picker that applies the chosen
locale to the document root via `lang` and `dir`, with optional
`localStorage` persistence and `navigator.languages` detection.

For the full contract see [spec.md](./spec.md) — it is the single
source of truth for the API, behaviour, and tests.

## Install

This directory is published as a folder-style import; consumers either
copy it into their project or wire it as a workspace dependency. The
only runtime dependency is `react` ≥ 19.

```ts
import {
    LocalePicker,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    type Props,
    type ChildArgs,
} from "./lily-design-system-react-locale-picker";
```

## Quick start

Render the picker with a `label` and the list of locales your app
supports. The picker writes `lang` and `dir` onto `<html>` so your
i18n library, your CSS (`html[dir="rtl"]`), and assistive technology
all see the change.

```tsx
"use client";

import { useState } from "react";
import { LocalePicker } from "./lily-design-system-react-locale-picker";

export function LanguageChooser() {
    const [locale, setLocale] = useState("");
    return (
        <LocalePicker
            label="Language"
            locales={["en", "en_US", "fr", "fr_CA", "ar", "he"]}
            value={locale}
            onChange={setLocale}
            storageKey="lily-locale"
            detectFromNavigator
        />
    );
}
```

When the user picks `ar`, the component:

- sets `lang="ar"` on `<html>`,
- sets `dir="rtl"` on `<html>` (auto-detected from the locale),
- writes `"ar"` to `localStorage["lily-locale"]`,
- fires `onChange("ar")` if provided.

The picker does NOT translate strings — that is the consumer's i18n
library (e.g. `react-intl`, `react-i18next`, Paraglide, Inlang, Tolgee,
raw `Intl.*`). Wire the controlled `value` or `onChange` to your
library so it loads the right messages.

## BCP 47 normalisation

Language tags follow **BCP 47** (RFC 5646). The `lang` attribute on
HTML elements must use hyphens, while many applications carry locale
identifiers with underscores (`en_US`, `zh_Hant_TW`). The picker
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

### Default radio group with NHS-style markup

```tsx
"use client";

import { useState } from "react";
import { LocalePicker } from "./lily-design-system-react-locale-picker";

export function NhsBanner() {
    const [locale, setLocale] = useState("en");
    return (
        <LocalePicker
            label="Language"
            locales={["en", "cy"]}
            value={locale}
            onChange={setLocale}
        />
    );
}

// Renders:
// <fieldset class="locale-picker" role="radiogroup" aria-label="Language">
//     <label class="locale-picker-option" lang="en">
//         <input type="radio" name="locale" value="en" checked />
//         <span class="locale-picker-option-label">English</span>
//     </label>
//     <label class="locale-picker-option" lang="cy">
//         <input type="radio" name="locale" value="cy" />
//         <span class="locale-picker-option-label">Welsh</span>
//     </label>
// </fieldset>
```

Each option is wrapped with its own `lang` attribute so a screen reader
pronounces "Cymraeg" with a Welsh voice (WCAG 3.1.2, Language of
Parts).

### Pretty labels for the option text

By default the picker uses the English names from `locales.tsv` (and
falls back to `Intl.DisplayNames` if available, then to the raw code).
Override per-code with `localeLabels`:

```tsx
<LocalePicker
    label="Langue"
    locales={["en", "fr", "ar"]}
    localeLabels={{ en: "English", fr: "Français", ar: "العربية" }}
    value={locale}
    onChange={setLocale}
/>
```

Each label is rendered inside a `lang="…"` block so each one is
announced in its own language.

### Driving a `<select>` instead of radios

Use the `children` render prop for full markup control. The picker
still owns the apply lifecycle:

```tsx
<LocalePicker
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
</LocalePicker>
```

### Driving a button group

```tsx
<LocalePicker
    label="Language"
    locales={["en", "fr", "ar"]}
    value={locale}
    onChange={setLocale}
>
    {({ locales, value, setLocale, labelFor, tagFor, isRtl }) => (
        <ul className="locale-picker-list">
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
</LocalePicker>
```

### Wiring an i18n library

```tsx
"use client";

import { useState } from "react";
import { useIntl } from "react-intl";
import { LocalePicker } from "./lily-design-system-react-locale-picker";

export function LanguageChooser({ onLocaleChange }: { onLocaleChange: (code: string) => void }) {
    const [current, setCurrent] = useState("");
    return (
        <LocalePicker
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
import { LocalePicker } from "./lily-design-system-react-locale-picker";

export function LocaleClient({ initialLocale }: { initialLocale: string }) {
    const [locale, setLocale] = useState(initialLocale);
    return (
        <LocalePicker
            label="Language"
            locales={["en", "fr", "ar"]}
            value={locale}
            onChange={setLocale}
        />
    );
}
```

During SSR the picker's parent layout already paints with the correct
`<html lang="…" dir="…">` from the cookie.

### Render into a scoped target instead of `<html>`

Set `target` to a specific element when you want the locale scoped to
a region (e.g. a multilingual side panel):

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { LocalePicker } from "./lily-design-system-react-locale-picker";

export function MultilingualPanel() {
    const ref = useRef<HTMLElement | null>(null);
    const [panelLocale, setPanelLocale] = useState("fr");
    const [, setReady] = useState(false);

    // Force re-render after refs resolve.
    useEffect(() => setReady(true), []);

    return (
        <section ref={ref}>
            <p>This panel switches language independently of the page.</p>
            <LocalePicker
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
} from "./lily-design-system-react-locale-picker";

console.log(defaultLocaleLabels["en_US"]); // "English (United States)"
console.log(RTL_LANGUAGE_TAGS.has("ar"));  // true
```

## Props

See [spec.md §4](./spec.md#4-public-api) for the full table.

Required props: `label`, `locales`.

Common optional props: `value` (controlled), `defaultValue`,
`storageKey`, `detectFromNavigator`, `localeLabels`, `applyDir`,
`target`, `onChange`, `className`, `name`, `children`.

## Accessibility

- `<fieldset role="radiogroup" aria-label="…">` is the announced
  container.
- Native `<input type="radio">` gives Arrow / Space / Tab semantics
  for free (WAI-ARIA APG, Radio Group pattern).
- Each visible option carries `lang="…"` so its name is pronounced
  in the right language (WCAG 3.1.2, Language of Parts).
- The document root carries `lang` and (by default) `dir` so the
  page satisfies WCAG 3.1.1 (Language of Page) and bidi text/layout
  inverts correctly for RTL locales.
- No colour-only meaning; the active state is also visible in the
  resolved `lang` attribute and in `aria-checked` on the radios.

## Tests

`pnpm test` under a vitest + jsdom + `@testing-library/react` setup
exercises every numbered acceptance criterion in
[spec.md §7](./spec.md#7-testing-acceptance-criteria) — 23 numbered
items plus extras for case-insensitive RTL detection and the
navigator-matcher helper.

## Files in this directory

| File                          | Purpose                                          |
| ----------------------------- | ------------------------------------------------ |
| `spec.md`                     | Single source of truth — API, behaviour, tests.  |
| `LocalePicker.tsx`            | The component implementation.                    |
| `LocalePicker.test.tsx`       | vitest suite covering every spec §7 item.        |
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
| [01-radios.tsx](./examples/01-radios.tsx)                                               | The default `<fieldset role="radiogroup">` rendering.              |
| [02-select.tsx](./examples/02-select.tsx)                                               | Native `<select>` dropdown via the `children` render prop.         |
| [03-buttons.tsx](./examples/03-buttons.tsx)                                             | Toggle-button group with short codes / glyphs.                     |
| [04-rtl-demo.tsx](./examples/04-rtl-demo.tsx)                                           | Live RTL preview — Arabic, Hebrew, Persian, Urdu, Pashto.          |
| [05-nhs-style.tsx](./examples/05-nhs-style.tsx)                                         | NHS UK-style language banner with endonyms.                        |
| [06-with-react-intl.tsx](./examples/06-with-react-intl.tsx)                             | Binding to react-intl's `locale` prop.                             |
| [07-with-react-i18next.tsx](./examples/07-with-react-i18next.tsx)                       | Driving react-i18next's `changeLanguage()` from `onChange`.        |
| [08-ssr-cookie.tsx](./examples/08-ssr-cookie.tsx)                                       | Next.js App Router cookie-based SSR — no flash of default locale.  |
| [09-scoped-target.tsx](./examples/09-scoped-target.tsx)                                 | Multiple per-region pickers, each scoped to its own panel.         |
| [10-combobox.tsx](./examples/10-combobox.tsx)                                           | Native `<datalist>` type-ahead for 436 locales.                    |

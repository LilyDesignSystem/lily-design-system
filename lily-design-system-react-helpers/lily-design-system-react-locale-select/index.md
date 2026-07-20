# LocaleSelect (React helper)

A reusable, headless React 19 locale select — an icon button that opens
a dropdown listbox (WAI-ARIA APG Listbox pattern) — that applies the
chosen locale to the document root via `lang` and `dir`, with optional
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
supports. You get a globe button that opens a listbox of the locales.
Picking one writes `lang` and `dir` onto `<html>` so your i18n library,
your CSS (`html[dir="rtl"]`), and assistive technology all see the
change.

`label` is required and does real work: the globe glyph is
`aria-hidden`, so `label` is the button's only accessible name.

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
closed control shows only a glyph — it never displays or announces the
active language — so without this line the active locale is shown to
nobody and announced to nobody. `aria-live="polite"` announces
mutations only, so it stays quiet on first paint and speaks once per
user change, and `localeName()` turns the code into a human name. Keep
it visible where you can (it helps sighted and cognitively-loaded users
too); if your design cannot spare the space, hide it with a
visually-hidden class rather than dropping it — see
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

### Default rendering

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
// <div class="locale-select">
//     <input type="hidden" name="locale" value="en" />
//     <button type="button" class="locale-select-button" aria-label="Language"
//             aria-haspopup="listbox" aria-expanded="false" aria-controls="…-list">
//         <span class="locale-select-icon" aria-hidden="true">🌐</span>
//     </button>
//     <ul class="locale-select-list" id="…-list" role="listbox"
//         aria-label="Language" tabindex="-1" hidden>
//         <li class="locale-select-option" id="…-option-0" role="option"
//             aria-selected="true" data-active lang="en">English</li>
//         <li class="locale-select-option" id="…-option-1" role="option"
//             aria-selected="false" lang="cy">Welsh</li>
//     </ul>
// </div>
```

Each locale option carries its own `lang` attribute so a screen reader
pronounces "Cymraeg" with a Welsh voice (WCAG 3.1.2, Language of
Parts). The button and the list carry no `lang` — they are not
locale-specific.

The glyph is U+1F310 GLOBE WITH MERIDIANS + U+FE0E VARIATION SELECTOR-15, exported
as `GLOBE_WITH_MERIDIANS`. It is `aria-hidden`, so the button's
accessible name comes entirely from `label`.

Option and list ids come from React's `useId`, so they are stable
across server and client render and survive hydration.

### Keyboard

The control implements the WAI-ARIA APG Listbox keyboard contract
itself — none of it comes from the platform.

On the button:

| Key                             | Action                                              |
| ------------------------------- | --------------------------------------------------- |
| `ArrowDown` / `Enter` / `Space` | Open with the current locale active; focus moves to the list. |
| `ArrowUp`                       | Open with the **last** option active.               |

On the open listbox:

| Key                     | Action                                                    |
| ----------------------- | --------------------------------------------------------- |
| `ArrowDown` / `ArrowUp` | Move the active option; clamps at the ends, no wrapping.  |
| `Home` / `End`          | Jump to the first / last option.                          |
| `Enter` / `Space`       | Select, apply, close, and return focus to the button.     |
| `Escape`                | Close and return focus, leaving the locale unchanged.     |
| `Tab`                   | Close and let focus move on.                              |
| Any printable character | Typeahead over the option labels (500 ms buffer).         |

Clicking an option selects it; clicking outside, or moving focus out of
the control, closes the list without changing the locale.

### Styling

This package ships no CSS. Full guide in
[docs/styling.md](./docs/styling.md); the class hooks are:

| Hook                         | Element                                     |
| ---------------------------- | ------------------------------------------- |
| `.locale-select`             | Root `<div>`.                               |
| `.locale-select-button`      | The trigger `<button>`.                     |
| `.locale-select-icon`        | The default glyph `<span>` (absent when you pass `children`). |
| `.locale-select-list`        | The `<ul role="listbox">`.                  |
| `.locale-select-option`      | Each `<li role="option">`.                  |
| `.locale-select-status`      | The consumer-rendered status line — you render it, and the examples always do. |

Two attribute hooks go with them: `[aria-selected="true"]` marks the
active locale, and `[data-active]` marks the option under the keyboard
cursor while the list is open. Style both, and do not rely on colour
alone (WCAG 1.4.1).

Open and close are driven purely by the `hidden` attribute, and the
package ships no positioning, so give the list a stacking context of
your own:

```css
.locale-select {
    position: relative;
}

.locale-select-list {
    position: absolute;
    inset-inline-start: 0;
    z-index: 1;
    margin: 0;
    padding: 0;
    list-style: none;
}

.locale-select-option[aria-selected="true"] {
    font-weight: 600;
}

.locale-select-option[data-active] {
    outline: 2px solid currentColor;
    outline-offset: -2px;
}
```

Do not override `.locale-select-list[hidden]` with a `display` value —
that would leave the list visible when it is meant to be closed.

### Styling the status line

Style the status line as ordinary body copy:

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

### Replacing the button glyph

The `children` render prop replaces what sits **inside** the button. It
does not render the options — the component owns the listbox, its
options, and the whole keyboard contract. It receives
`{ value, open, labelFor }`:

```tsx
<LocaleSelect
    label="Language"
    locales={["en", "fr", "es", "de", "ar"]}
    value={locale}
    onChange={setLocale}
    storageKey="lily-locale"
>
    {({ value, open, labelFor }) => (
        <span aria-hidden="true" title={labelFor(value)}>
            {value.split("_")[0].toUpperCase()} {open ? "▴" : "▾"}
        </span>
    )}
</LocaleSelect>
```

Mark your glyph `aria-hidden="true"`: the button already has its
accessible name from `label`, so unhidden content is announced twice.

Showing the active language in the button — a short code as above, or
the endonym — is worth doing. It offsets the main cost of an icon-only
control, which is that the active locale is otherwise invisible while
the list is closed:

```tsx
import { LocaleSelect, GLOBE_WITH_MERIDIANS } from "./lily-design-system-react-locale-select";

<LocaleSelect label="Language" locales={["en", "cy"]} value={locale} onChange={setLocale}>
    {({ value, labelFor }) => (
        <span aria-hidden="true">
            {GLOBE_WITH_MERIDIANS} {labelFor(value)}
        </span>
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

Common optional props: `value` (controlled), `defaultValue`,
`storageKey`, `detectFromNavigator`, `localeLabels`, `applyDir`,
`target`, `onChange`, `className`, `name` (on the hidden input),
`children` (button glyph override).

## Accessibility

- The `<button>` is the announced control: `aria-haspopup="listbox"`,
  `aria-expanded`, `aria-controls`, and `aria-label={label}`. Because
  the glyph is `aria-hidden`, `label` is its only accessible name.
- The `<ul role="listbox">` holds focus while open and marks the
  keyboard cursor with `aria-activedescendant`; options carry
  `aria-selected` and a `data-active` styling hook.
- Full APG Listbox keyboard contract — see [Keyboard](#keyboard) above.
- Each locale option carries `lang="…"` so its name is pronounced
  in the right language (WCAG 3.1.2, Language of Parts).
- The document root carries `lang` and (by default) `dir` so the
  page satisfies WCAG 3.1.1 (Language of Page) and bidi text/layout
  inverts correctly for RTL locales.
- No colour-only meaning; state rides on `aria-selected`,
  `data-active`, and the resolved `lang` attribute.
- **Tradeoffs.** An icon-only control depends entirely on `aria-label`
  for its name; a custom listbox has weaker assistive-technology
  support than a native `<select>`; and the globe glyph is
  font-dependent and culturally loaded. The default pattern compensates
  with a visible `.locale-select-status` live region beside the control
  — see [docs/accessibility.md](./docs/accessibility.md) for the full
  discussion.

## Tests

`pnpm test` under a vitest + jsdom + `@testing-library/react` setup
exercises every numbered acceptance criterion in
[spec/index.md §7](./spec/index.md#7-testing-acceptance-criteria) — 27 numbered
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
| [docs/props-reference.md](./docs/props-reference.md) | Field-by-field reference for every prop.                            |
| [docs/concepts.md](./docs/concepts.md)               | Mental model, lifecycle diagram, why the defaults are what they are. |
| [docs/bcp47.md](./docs/bcp47.md)                     | Language-tag syntax (RFC 5646), IANA registry, subtag composition.   |
| [docs/rtl.md](./docs/rtl.md)                         | What's auto-detected, what `dir="rtl"` actually changes, CSS tips.   |
| [docs/i18n-integration.md](./docs/i18n-integration.md) | Wiring react-intl, react-i18next, Paraglide, Tolgee, raw `Intl.*`. |
| [docs/ssr.md](./docs/ssr.md)                         | Cookie, URL-prefix, Accept-Language, streaming SSR, FOUC avoidance.  |
| [docs/accessibility.md](./docs/accessibility.md)     | WCAG 2.2 AAA mapping, keyboard contract, screen-reader matrix.       |
| [docs/styling.md](./docs/styling.md)                 | Class hooks, attribute hooks, positioning, baseline CSS.            |
| [docs/custom-rendering.md](./docs/custom-rendering.md) | Replacing the button glyph via the `children` render prop.        |
| [docs/recipes.md](./docs/recipes.md)                 | Cookbook of adjacent problems.                                      |
| [docs/troubleshooting.md](./docs/troubleshooting.md) | Symptoms, root causes, fixes.                                       |

## Examples

Each file in `examples/` is a complete, runnable React 19 component
you can copy into your project.

| Example                                                                                 | Demonstrates                                                       |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [basic.tsx](./examples/basic.tsx)                                               | The default globe-button rendering + the default status line.      |
| [custom-rendering.tsx](./examples/custom-rendering.tsx)                                               | `children` glyph override showing the active short code + chevron. |
| [compact-glyph.tsx](./examples/compact-glyph.tsx)                                             | Compact glyph button with short codes / script characters.         |
| [rtl-demo.tsx](./examples/rtl-demo.tsx)                                           | Live RTL preview — Arabic, Hebrew, Persian, Urdu, Pashto.          |
| [nhs-style.tsx](./examples/nhs-style.tsx)                                         | NHS UK-style language banner: globe + endonym in the button.       |
| [with-react-intl.tsx](./examples/with-react-intl.tsx)                             | Binding to react-intl's `locale` prop.                             |
| [with-react-i18next.tsx](./examples/with-react-i18next.tsx)                       | Driving react-i18next's `changeLanguage()` from `onChange`.        |
| [ssr-cookie.tsx](./examples/ssr-cookie.tsx)                                       | Next.js App Router cookie-based SSR — no flash of default locale.  |
| [scoped-target.tsx](./examples/scoped-target.tsx)                                 | Multiple per-region selects, each scoped to its own panel.         |
| [all-locales.tsx](./examples/all-locales.tsx)                                           | All 436 locales, navigated with the built-in listbox typeahead.    |

---

Lily™ and Lily Design System™ are trademarks.

# LocaleSelect (Angular helper)

A reusable, headless Angular 20 locale picker that applies the
chosen locale to the document root via `lang` and `dir`, with
optional `localStorage` persistence and `navigator.languages`
detection.

For the full contract see [spec.md](./spec.md) — it is the single
source of truth for the API, behaviour, and tests. For topic
deep-dives see [docs/](./docs/) and for working code see
[examples/](./examples/).

## Table of contents

- [Install](#install)
- [Quick start](#quick-start)
- [BCP 47 normalisation](#bcp-47-normalisation)
- [RTL auto-detection](#rtl-auto-detection)
- [Examples](#examples)
- [Built-in locale data](#built-in-locale-data)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Accessibility](#accessibility)
- [SSR](#ssr)
- [Files in this directory](#files-in-this-directory)
- [Documentation](#documentation)
- [Examples directory](#examples-directory)

## Install

This directory is published as a folder-style import; consumers
either copy it into their project or wire it as a workspace
dependency. The only runtime dependencies are `@angular/core` and
`@angular/common` (Angular 20+).

```ts
import { LocaleSelect } from "./lily-design-system-angular-locale-select";
```

Or via the barrel (recommended; gives you the typed helpers too):

```ts
import {
    LocaleSelect,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
} from "./lily-design-system-angular-locale-select";
```

## Quick start

Render the picker with a `label` and the list of locales your app
supports. The picker writes `lang` and `dir` onto `<html>` so your
i18n library, your CSS (`html[dir="rtl"]`), and assistive
technology all see the change.

```ts
import { Component, signal } from "@angular/core";
import { LocaleSelect } from "./lily-design-system-angular-locale-select";

@Component({
    selector: "app-settings",
    standalone: true,
    imports: [LocaleSelect],
    template: `
        <lily-locale-select
            label="Language"
            [locales]="locales"
            [(value)]="locale"
            storageKey="lily-locale"
            [detectFromNavigator]="true"
            (localeChange)="onLocaleChange($event)"
        />
    `,
})
export class Settings {
    locales = ["en", "en_US", "fr", "fr_CA", "ar", "he"];
    locale = signal("");

    onLocaleChange(code: string) {
        // Wire to your i18n library here.
    }
}
```

When the user picks `ar`, the component:

- sets `lang="ar"` on `<html>`,
- sets `dir="rtl"` on `<html>` (auto-detected from the locale),
- writes `"ar"` to `localStorage["lily-locale"]`,
- updates the `value` signal,
- emits `localeChange("ar")`.

The picker does NOT translate strings — that is the consumer's i18n
library (e.g. `@angular/localize`, Transloco, ngx-translate, raw
`Intl.*`). Wire the bindable `value` or the `localeChange` event to
your library so it loads the right messages.

## BCP 47 normalisation

Language tags follow **BCP 47** (RFC 5646). The `lang` attribute on
HTML elements must use hyphens, while many applications carry
locale identifiers with underscores (`en_US`, `zh_Hant_TW`). The
picker accepts whichever form you prefer in the `locales` array and
converts to the hyphen form when writing to the DOM. The bindable
`value` preserves your original form, so round-trips are lossless.

```ts
bcp47LocaleTag("en_US");      // "en-US"
bcp47LocaleTag("zh_Hant_TW"); // "zh-Hant-TW"
bcp47LocaleTag("en");         // "en"
```

References:

- W3C — [Language tags in HTML and XML](https://www.w3.org/International/articles/language-tags/)
- IETF — [RFC 5646 (BCP 47), Tags for Identifying Languages](https://www.rfc-editor.org/rfc/rfc5646)
- IANA — [Language Subtag Registry (registry file)](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry)

## RTL auto-detection

`isRtlLocale(locale)` returns `true` for any locale whose base
language is one of `ar`, `arc`, `ckb`, `dv`, `fa`, `he`, `iw`,
`ji`, `ks`, `ku`, `mzn`, `ps`, `sd`, `ug`, `ur`, `yi`, OR whose
script subtag is one of `Arab`, `Hebr`, `Thaa`, `Syrc`, `Nkoo`,
`Mong`, `Adlm`.

```ts
isRtlLocale("ar");         // true
isRtlLocale("he_IL");      // true
isRtlLocale("uz_Arab_AF"); // true (script subtag)
isRtlLocale("en");         // false
```

Pass `[applyDir]="false"` if you want full control of `dir`
yourself.

## Examples

### Default select

```ts
import { Component, signal } from "@angular/core";
import { LocaleSelect } from "./lily-design-system-angular-locale-select";

@Component({
    standalone: true,
    imports: [LocaleSelect],
    template: `
        <lily-locale-select
            label="Language"
            [locales]="['en', 'cy']"
            [(value)]="locale"
        />
    `,
})
export class Settings {
    locale = signal("en");
}
```

Renders:

```html
<select class="locale-select" aria-label="Language" name="locale">
    <option class="locale-select-option" value="en" lang="en">English</option>
    <option class="locale-select-option" value="cy" lang="cy">Welsh</option>
</select>
```

Each option carries its own `lang` attribute so a screen reader
pronounces "Cymraeg" with a Welsh voice (WCAG 3.1.2, Language of
Parts).

### Pretty labels for the option text

By default the picker uses the English names from `locales.tsv`
(and falls back to `Intl.DisplayNames` if available, then to the
raw code). Override per-code with `localeLabels`:

```html
<lily-locale-select
    label="Langue"
    [locales]="['en', 'fr', 'ar']"
    [localeLabels]="{ en: 'English', fr: 'Français', ar: 'العربية' }"
    [(value)]="locale"
/>
```

### Server-resolved initial value (SSR)

For flicker-free first paint, resolve the locale on the server
(from a cookie or `Accept-Language`) and pass it via an injection
token:

```ts
import { Component, inject, signal } from "@angular/core";
import { LocaleSelect } from "./lily-design-system-angular-locale-select";
import { INITIAL_LOCALE } from "./tokens/initial-locale";

@Component({
    standalone: true,
    imports: [LocaleSelect],
    template: `
        <lily-locale-select
            label="Language"
            [locales]="['en', 'fr', 'ar']"
            [(value)]="locale"
            [value]="locale()"
        />
    `,
})
export class App {
    locale = signal(inject(INITIAL_LOCALE));
}
```

During SSR the component renders the `<select>` with the supplied
value selected, and the document already arrives with the correct
`lang` attribute on `<html>`.

### Render into a scoped target instead of `<html>`

Set `target` to a specific element when you want the locale scoped
to a region (e.g. a multilingual side panel):

```ts
import { Component, ElementRef, signal, viewChild } from "@angular/core";
import { LocaleSelect } from "./lily-design-system-angular-locale-select";

@Component({
    standalone: true,
    imports: [LocaleSelect],
    template: `
        <section #region>
            <p>This panel switches language independently of the page.</p>
            <lily-locale-select
                label="Panel language"
                [locales]="['en', 'fr', 'ar']"
                [target]="region.nativeElement"
                [(value)]="panelLocale"
            />
        </section>
    `,
})
export class Panel {
    region = viewChild<ElementRef<HTMLElement>>("region");
    panelLocale = signal("fr");
}
```

`<html>` stays in the page's default locale; the section gets the
chosen one.

## Built-in locale data

`locales.ts` ships the 436 codes from `locales.tsv` mapped to their
English names. The component falls back to this table when
`localeLabels` does not have an entry for a code. You can also
import the data directly:

```ts
import {
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
} from "./lily-design-system-angular-locale-select";

console.log(defaultLocaleLabels["en_US"]); // "English (United States)"
console.log(RTL_LANGUAGE_TAGS.has("ar"));  // true
```

## Inputs

See [spec.md §4](./spec.md#4-public-api) for the full table.

Required inputs: `label`, `locales`.

Common optional inputs: `value` (bindable via `[(value)]`),
`defaultValue`, `storageKey`, `detectFromNavigator`, `localeLabels`,
`applyDir`, `target`, `className`, `name`.

## Outputs

| Output         | Payload  | When                                                  |
| -------------- | -------- | ----------------------------------------------------- |
| `valueChange`  | `string` | Implicit on the `value` model signal — drives `[(value)]`. |
| `localeChange` | `string` | After the picker applies a new locale (consumer-form code). |

## Accessibility

- `<select [attr.aria-label]="…">` is the announced control
  (implicit `combobox` role).
- The native `<select>` gives Arrow / Home / End / typeahead
  semantics for free.
- Each `<option>` carries `lang="…"` so its name is pronounced
  in the right language (WCAG 3.1.2, Language of Parts).
- The document root carries `lang` and (by default) `dir` so the
  page satisfies WCAG 3.1.1 (Language of Page) and bidi
  text/layout inverts correctly for RTL locales.
- No colour-only meaning; the active state is also visible in the
  resolved `lang` attribute and in the `<select>`'s current value.

## SSR

The picker is SSR-safe — all DOM writes happen inside an `effect()`
that's guarded by `typeof document !== "undefined"`. For
flicker-free first paint, resolve the locale on the server (cookie
/ `Accept-Language`) and pass it via an injection token. See
[docs/ssr.md](./docs/ssr.md) for the Analog v1 recipe.

## Files in this directory

| File                              | Purpose                                          |
| --------------------------------- | ------------------------------------------------ |
| `spec.md`                         | Single source of truth — API, behaviour, tests.  |
| `AGENTS.md`                       | Fast-index pointer; loads the AGENTS bundle.     |
| `AGENTS/`                         | Topic-by-topic agent files.                      |
| `CLAUDE.md`                       | `@AGENTS.md`.                                    |
| `locale-select.component.ts`      | The component implementation.                    |
| `locale-select.component.spec.ts` | vitest suite covering every spec §7 item.        |
| `locales.ts`                      | Built-in code → English-name map and RTL sets.   |
| `locales.tsv`                     | Canonical 436-row source for `locales.ts`.       |
| `index.ts`                        | Re-export barrel.                                |
| `index.md`                        | This file.                                       |
| `docs/`                           | Deep-dive guides — see [Documentation](#documentation). |
| `examples/`                       | Runnable Angular component files — see [Examples directory](#examples-directory). |
| `CHANGELOG.md`                    | Version history.                                 |

## Documentation

| Guide                                                | Covers                                                                       |
| ---------------------------------------------------- | ---------------------------------------------------------------------------- |
| [docs/concepts.md](./docs/concepts.md)               | Mental model, lifecycle diagram, why the defaults are what they are.         |
| [docs/bcp47.md](./docs/bcp47.md)                     | Language-tag syntax (RFC 5646), IANA registry, subtag composition.           |
| [docs/rtl.md](./docs/rtl.md)                         | What's auto-detected, what `dir="rtl"` actually changes, CSS tips.           |
| [docs/i18n-integration.md](./docs/i18n-integration.md) | Wiring @angular/localize, Transloco, ngx-translate, raw `Intl.*`.          |
| [docs/ssr.md](./docs/ssr.md)                         | Cookie, URL-prefix, Accept-Language, FOUC avoidance for Analog v1.           |
| [docs/accessibility.md](./docs/accessibility.md)     | WCAG 2.2 AAA mapping, keyboard contract, screen-reader matrix.               |

## Examples directory

Each file in `examples/` is a complete, runnable Angular 20
standalone component you can copy into your project.

| Example                                                                                | Demonstrates                                                       |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [01-radios.component.ts](./examples/01-radios.component.ts)                            | The default native `<select>` rendering.                          |
| [02-select.component.ts](./examples/02-select.component.ts)                            | Sibling `<select>` widget bound to `[(value)]` for long locale lists. |
| [03-buttons.component.ts](./examples/03-buttons.component.ts)                          | Toggle-button group with short codes / glyphs.                     |
| [04-rtl-demo.component.ts](./examples/04-rtl-demo.component.ts)                        | Live RTL preview — Arabic, Hebrew, Persian, Urdu, Pashto.          |
| [05-nhs-style.component.ts](./examples/05-nhs-style.component.ts)                      | NHS UK-style language banner with endonyms.                        |
| [06-with-transloco.component.ts](./examples/06-with-transloco.component.ts)            | Binding to Transloco's active language.                            |
| [07-with-ngx-translate.component.ts](./examples/07-with-ngx-translate.component.ts)    | Driving `TranslateService.use()` from `(localeChange)`.            |
| [08-ssr-cookie.component.ts](./examples/08-ssr-cookie.component.ts)                    | Analog cookie-based SSR — no flash of default locale.              |
| [09-scoped-target.component.ts](./examples/09-scoped-target.component.ts)              | Multiple per-region pickers, each scoped to its own panel.         |
| [10-combobox.component.ts](./examples/10-combobox.component.ts)                        | Native `<datalist>` type-ahead for 436 locales.                    |

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.

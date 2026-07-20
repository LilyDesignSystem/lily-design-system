# LocaleSelect (Angular helper)

A reusable, headless Angular 20 locale select. It renders a globe
icon button that opens a WAI-ARIA APG listbox of locales, and applies
the chosen locale to the document root via `lang` and `dir`, with
optional `localStorage` persistence and `navigator.languages`
detection.

For the full contract see [spec/index.md](./spec/index.md) — it is the single
source of truth for the API, behaviour, and tests. For topic
deep-dives see [docs/](./docs/) and for working code see
[examples/](./examples/).

## Table of contents

- [Install](#install)
- [Quick start](#quick-start)
- [BCP 47 normalisation](#bcp-47-normalisation)
- [RTL auto-detection](#rtl-auto-detection)
- [Examples](#examples)
- [Styling hooks](#styling-hooks)
- [Built-in locale data](#built-in-locale-data)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Keyboard](#keyboard)
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
    LocaleSelectIcon,
    GLOBE_WITH_MERIDIANS,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
} from "./lily-design-system-angular-locale-select";
```

## Quick start

Render the select with a `label` and the list of locales your app
supports. The select writes `lang` and `dir` onto `<html>` so your
i18n library, your CSS (`html[dir="rtl"]`), and assistive
technology all see the change.

```ts
import { Component, signal } from "@angular/core";
import {
    LocaleSelect,
    bcp47LocaleTag,
    localeName,
} from "./lily-design-system-angular-locale-select";

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

        <p class="locale-select-status" aria-live="polite">
            Active language:
            <span [attr.lang]="tagFor(locale())">{{ nameFor(locale()) }}</span>
        </p>
    `,
})
export class Settings {
    locales = ["en", "en_US", "fr", "fr_CA", "ar", "he"];
    locale = signal("");

    nameFor = localeName;
    tagFor = bcp47LocaleTag;

    onLocaleChange(code: string) {
        // Wire to your i18n library here.
    }
}
```

The status line is part of the pattern, not decoration. The closed
control shows a globe glyph and nothing else — never the active locale
name — so on its own it never tells any user which locale is in
effect. The `locale-select-status` element restores that, in visible
text, for sighted and screen-reader users alike; `aria-live="polite"`
announces only changes, so it is silent on first paint and speaks once
per switch. The locale name carries its own `lang` for the same reason
each option does, so it is pronounced in the language it names. Keep
it unless you have a specific reason not to, and prefer visually
hiding it over deleting it. Full rationale and the opt-out:
[docs/accessibility.md](./docs/accessibility.md).

When the user picks `ar`, the component:

- sets `lang="ar"` on `<html>`,
- sets `dir="rtl"` on `<html>` (auto-detected from the locale),
- writes `"ar"` to `localStorage["lily-locale"]`,
- updates the `value` signal,
- emits `localeChange("ar")`.

The select does NOT translate strings — that is the consumer's i18n
library (e.g. `@angular/localize`, Transloco, ngx-translate, raw
`Intl.*`). Wire the bindable `value` or the `localeChange` event to
your library so it loads the right messages.

## BCP 47 normalisation

Language tags follow **BCP 47** (RFC 5646). The `lang` attribute on
HTML elements must use hyphens, while many applications carry
locale identifiers with underscores (`en_US`, `zh_Hant_TW`). The
select accepts whichever form you prefer in the `locales` array and
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

### Default rendering

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

Renders (listbox closed):

```html
<div class="locale-select">
    <input type="hidden" name="locale" value="en" />
    <button type="button" class="locale-select-button" aria-label="Language"
            aria-haspopup="listbox" aria-expanded="false"
            aria-controls="locale-select-1-list">
        <span class="locale-select-icon" aria-hidden="true">&#127760;</span>
    </button>
    <ul class="locale-select-list" id="locale-select-1-list" role="listbox"
        aria-label="Language" tabindex="-1" hidden>
        <li class="locale-select-option" id="locale-select-1-option-0" role="option"
            aria-selected="true" data-active lang="en">English</li>
        <li class="locale-select-option" id="locale-select-1-option-1" role="option"
            aria-selected="false" lang="cy">Welsh</li>
    </ul>
</div>
```

While open, the button's `aria-expanded` flips to `"true"`, the `<ul>`
loses `hidden` and gains `aria-activedescendant` pointing at the
active option's `id`, and `data-active` marks that option.

Each locale option carries its own `lang` attribute so a screen reader
pronounces "Cymraeg" with a Welsh voice (WCAG 3.1.2, Language of
Parts). The button and the list carry no `lang` of their own — their
text is in the page's language, not any listed locale's.

The hidden input carries the value into an enclosing `<form>`; set
`name` to control its field name.

### Replacing the button glyph

Project an `<ng-template>` to replace the globe. It replaces the glyph
only — the listbox is component-owned and the template never renders
options.

```html
<lily-locale-select label="Language" [locales]="locales" [(value)]="locale">
    <ng-template let-args>{{ args.labelFor(args.value) }}</ng-template>
</lily-locale-select>
```

The context (`ChildArgs`) gives you three things:

| Key        | Type                         | Meaning                            |
| ---------- | ---------------------------- | ---------------------------------- |
| `value`    | `string`                     | Selected locale code, your form.   |
| `open`     | `boolean`                    | Is the listbox open?               |
| `labelFor` | `(locale: string) => string` | Resolve a code to a display label. |

Import the optional `LocaleSelectIcon` directive if you want typed
`let-` variables:

```html
<lily-locale-select label="Language" [locales]="locales" [(value)]="locale">
    <ng-template lilyLocaleSelectIcon let-args>
        <span [attr.data-open]="args.open">{{ args.value }}</span>
    </ng-template>
</lily-locale-select>
```

The default glyph is exported as `GLOBE_WITH_MERIDIANS` if you want to
reuse it elsewhere.

Because the closed control never shows the active locale, read it from
`[(value)]` or the `localeChange` output and surface it yourself. See
[docs/accessibility.md](./docs/accessibility.md) for the tradeoffs and
the status-region pattern.

### Pretty labels for the option text

By default the select uses the English names from `locales.tsv`
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

During SSR the component renders the button and the closed listbox
with the supplied value marked `aria-selected`, and the document
already arrives with the correct `lang` attribute on `<html>`. Element
ids come from a module counter rather than randomness, so server and
client markup match and hydration is clean.

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

## Styling hooks

The package ships **zero CSS**. These are the class hooks it emits:

| Hook                    | Element                | Notes                                            |
| ----------------------- | ---------------------- | ------------------------------------------------ |
| `.locale-select`        | root `<div>`           | Plus whatever you pass as `className`.           |
| `.locale-select-button` | the trigger `<button>` | Icon-only by default.                            |
| `.locale-select-icon`   | the glyph `<span>`     | Absent when you project your own `<ng-template>`. |
| `.locale-select-list`   | the `<ul role="listbox">` | Carries `hidden` while closed.                |
| `.locale-select-option` | each `<li role="option">` | Style selection with `[aria-selected="true"]` and the keyboard-active option with `[data-active]`. |

**The list needs positioning CSS and this package ships none.** As
rendered, the `<ul>` sits in normal document flow and pushes the rest
of the page down when it opens. To overlay it, position the list
absolutely inside a relatively-positioned root:

```css
.locale-select {
    position: relative;
}

.locale-select-list {
    position: absolute;
    top: 100%;
    inset-inline-start: 0;
    z-index: 1;
}
```

`inset-inline-start` rather than `left` so the list anchors correctly
when `dir="rtl"` — which this very component sets.

Two more things you own: a visible focus ring on both the button and
the `<ul>` (the list is what receives focus while open), and a
distinguishable style for `[data-active]` versus
`[aria-selected="true"]`, since they are different states and can be
on different options.

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

See [spec/index.md §4](./spec/index.md#4-public-api) for the full table.

Required inputs: `label`, `locales`.

Common optional inputs: `value` (bindable via `[(value)]`),
`defaultValue`, `storageKey`, `detectFromNavigator`, `localeLabels`,
`applyDir`, `target`, `className`, `name`.

`label` names both the button and the listbox. The button is
icon-only, so this is its **entire** accessible name — write it as
carefully as you would write visible link text.

## Outputs

| Output         | Payload  | When                                                  |
| -------------- | -------- | ----------------------------------------------------- |
| `valueChange`  | `string` | Implicit on the `value` model signal — drives `[(value)]`. |
| `localeChange` | `string` | After the select applies a new locale (consumer-form code). |

## Keyboard

The control implements the
[WAI-ARIA APG listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/).
None of this is inherited from a native `<select>` — it is all the
component's own.

On the **button**:

| Key                   | Action                                                       |
| --------------------- | ------------------------------------------------------------ |
| Tab / Shift+Tab       | Move focus to / from the button.                             |
| Enter / Space         | Open the list on the selected option (or the first).         |
| Arrow Down            | Open the list on the selected option (or the first).         |
| Arrow Up              | Open the list on the **last** option.                        |

Opening moves focus to the list.

On the **list**:

| Key                   | Action                                                       |
| --------------------- | ------------------------------------------------------------ |
| Arrow Down / Arrow Up | Move the active option. Clamps at the ends; does not wrap.   |
| Home / End            | Jump to the first / last option.                             |
| Enter / Space         | Choose the active option, apply it, close, focus the button. |
| Escape                | Close and focus the button; the locale is unchanged.         |
| Tab                   | Close and let focus move on normally.                        |
| Any printable key     | Typeahead over the option labels; resets 500 ms after your last keystroke. |

With a mouse: clicking the button toggles the list, clicking an option
chooses it, and clicking anywhere outside closes the list. Moving
focus out of the control closes it too.

## Accessibility

- The button carries `aria-label`, `aria-haspopup="listbox"`,
  `aria-expanded`, and `aria-controls`; the list is a
  `role="listbox"` with `aria-activedescendant` while open; options
  are `role="option"` with `aria-selected`.
- Each locale option carries `lang="…"` so its name is pronounced in
  the right language (WCAG 3.1.2, Language of Parts). The button and
  the list carry none of their own.
- The document root carries `lang` and (by default) `dir` so the
  page satisfies WCAG 3.1.1 (Language of Page) and bidi
  text/layout inverts correctly for RTL locales.
- No colour-only meaning; the active state is exposed via
  `aria-selected`, the resolved `lang` attribute, and the `[(value)]`
  binding.
- Focus stays on the `<ul>` while the list is open — style its focus
  ring, not the options'.

Three tradeoffs, stated plainly and covered in full in
[docs/accessibility.md](./docs/accessibility.md):

1. An icon-only button depends **entirely** on your `label` for its
   accessible name. A poor label leaves the control unusable to
   screen-reader and voice-control users.
2. A custom listbox has weaker and less consistent assistive-technology
   support than a native `<select>`, which gets platform behaviour for
   free. This is a real regression, not a neutral difference.
3. The globe glyph may render differently, render as tofu, or be
   missing entirely depending on platform fonts and emoji coverage.

The closed button also never shows the active locale — surface it
separately with the status-region pattern.

## SSR

The select is SSR-safe — all DOM writes happen inside an `effect()`
that's guarded by `typeof document !== "undefined"`. For
flicker-free first paint, resolve the locale on the server (cookie
/ `Accept-Language`) and pass it via an injection token. See
[docs/ssr.md](./docs/ssr.md) for the Analog v1 recipe.

## Files in this directory

| File                              | Purpose                                          |
| --------------------------------- | ------------------------------------------------ |
| `spec/index.md`                         | Single source of truth — API, behaviour, tests.  |
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
| [docs/props-reference.md](./docs/props-reference.md) | Every input, output, and exported helper, with types and defaults.          |
| [docs/styling.md](./docs/styling.md)                 | Class hooks, listbox positioning, logical properties, focus and state.      |
| [docs/custom-rendering.md](./docs/custom-rendering.md) | Replacing the button glyph, and the sibling-widget contract.               |
| [docs/recipes.md](./docs/recipes.md)                 | Short task-shaped snippets for the common wiring jobs.                      |
| [docs/troubleshooting.md](./docs/troubleshooting.md) | Symptom → cause → fix for the things that actually go wrong.                |

## Examples directory

Each file in `examples/` is a complete, runnable Angular 20
standalone component you can copy into your project.

| Example                                                                                | Demonstrates                                                       |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| [basic.component.ts](./examples/basic.component.ts)                            | The default button + listbox rendering, with the status region.   |
| [sibling-select.component.ts](./examples/sibling-select.component.ts)                            | Sibling native `<select>` bound to `[(value)]` for long locale lists. |
| [sibling-buttons.component.ts](./examples/sibling-buttons.component.ts)                          | Toggle-button group with short codes / glyphs.                     |
| [rtl-demo.component.ts](./examples/rtl-demo.component.ts)                        | Live RTL preview — Arabic, Hebrew, Persian, Urdu, Pashto.          |
| [nhs-style.component.ts](./examples/nhs-style.component.ts)                      | NHS UK-style language banner with endonyms.                        |
| [with-transloco.component.ts](./examples/with-transloco.component.ts)            | Binding to Transloco's active language.                            |
| [with-ngx-translate.component.ts](./examples/with-ngx-translate.component.ts)    | Driving `TranslateService.use()` from `(localeChange)`.            |
| [analog-cookie.component.ts](./examples/analog-cookie.component.ts)                    | Analog cookie-based SSR — no flash of default locale.              |
| [scoped-target.component.ts](./examples/scoped-target.component.ts)              | Multiple per-region selects, each scoped to its own panel.         |
| [combobox.component.ts](./examples/combobox.component.ts)                        | Native `<datalist>` type-ahead for 436 locales.                    |

## License

MIT or Apache-2.0 or GPL-2.0 or GPL-3.0 or BSD-3-Clause. Contact
joel@joelparkerhenderson.com for other terms.

---

Lily™ and Lily Design System™ are trademarks.

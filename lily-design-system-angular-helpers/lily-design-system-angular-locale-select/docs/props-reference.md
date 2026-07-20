# Props reference

Field-by-field reference for every public input, output, and exported
helper. The contract is owned by [`../spec/index.md`](../spec/index.md)
§4; this file expands the rationale and common usage. For the
narrative introduction see [`../index.md`](../index.md).

Angular reading notes, since they trip people up coming from the
Svelte or React ports of this helper:

- Inputs are **signal inputs**. Inside the component they are read as
  `label()`, `locales()`, `value()` — a call, not a property.
- Template binding names are **camelCase**, not kebab-case:
  `[detectFromNavigator]`, `[localeLabels]`, `[applyDir]`.
- `[(value)]` is a `model<string>()`, so the thing you bind must be a
  `WritableSignal<string>` — `signal("")`, not a plain field.

## `label` — required, string

Applied as `aria-label` to **both** the trigger button and the
listbox. Always supplied, always translatable.

```html
<lily-locale-select label="Language" [locales]="locales" />
```

The input is marked `input.required<string>()`, so the TypeScript
compiler enforces it on every binding site — and it is required for a
reason. The button is icon-only and its globe glyph is `aria-hidden`,
so `aria-label` is the **entire** accessible name the control has. A
vague value leaves screen-reader users without a description and
voice-control users without a phrase to say. Name the setting
("Language", "Site language"), not the widget ("Select", "Options").
See [`accessibility.md`](./accessibility.md).

Note that `label` names the control, not the current selection. The
closed button never shows the active locale — surface that separately
with the status-region pattern.

## `locales` — required, string[]

The locale codes the select exposes as options — one
`<li role="option">` each, in array order. The code is both the
identity of the selection and the value written (in BCP 47 hyphen
form) to the `lang` attribute.

```html
<lily-locale-select
    label="Language"
    [locales]="['en', 'en_US', 'fr', 'fr_CA', 'ar', 'he']"
    [(value)]="locale"
/>
```

Either separator works. Underscore forms (`en_US`) and hyphen forms
(`en-US`) are both accepted; the component normalises to hyphens when
writing to the DOM and preserves your form in `value` and in the
`localeChange` payload. Mixing the two in one array is legal but
pointless — pick whichever your i18n library already uses. See
[`bcp47.md`](./bcp47.md).

The component does no locale negotiation and no auto-discovery: this
array is the complete list of what the user may pick.

## `value` — optional, string (`model`)

The active locale code, in your form. Two-way bindable with
`[(value)]` so the surrounding code can read and write the selection.

```html
<lily-locale-select [(value)]="locale" ... />
```

```ts
locale = signal("");
```

When supplied as a non-empty string, the select treats it as the
authoritative initial value — storage, navigator detection, and
`defaultValue` are all skipped on the first effect run. This is the
hook for server-resolved locales; see [`ssr.md`](./ssr.md).

`value` is the single source of truth for everything downstream:
the `lang` write, the `dir` write, persistence, the hidden input, and
the `localeChange` emission all run off it.

## `defaultValue` — optional, string — defaults to `""`

Used during initial-value resolution when `value` is empty, nothing
was stored, and navigator detection either was disabled or found no
match. If `defaultValue` is itself empty, the resolver falls back to
`"en"` (when present in `locales`) and then to `locales[0]`.

```html
<lily-locale-select defaultValue="fr" ... />
```

## `storageKey` — optional, string — defaults to `""`

`localStorage` key for persistence. When set to a non-empty string,
the select:

- Reads the stored code during initial-value resolution, ahead of
  navigator detection and `defaultValue`.
- Writes the code to storage after every successful apply.

Errors (private mode, quota, disabled storage) are silently
swallowed on both read and write — the select continues to work
in-memory.

```html
<lily-locale-select storageKey="lily-locale" ... />
```

The stored string is the consumer-form code, not the normalised tag,
so a stored `"en_US"` round-trips back into a `locales` array written
with underscores.

## `detectFromNavigator` — optional, boolean — defaults to `false`

When true, and when neither `value` nor storage supplied a code, the
select matches `navigator.languages` (falling back to
`navigator.language`) against `locales` using
[`matchNavigatorLanguage`](#matchnavigatorlanguage). The match is
exact-first, then language-only, so a browser preferring `fr-CH`
lands on `fr` if `fr-CH` is not offered.

```html
<lily-locale-select [detectFromNavigator]="true" ... />
```

Off by default, deliberately. Browser language preferences are often
stale or wrong for a given site, and silently switching a user's
language on first visit is a surprising default. Turn it on when your
audience is genuinely multilingual and the guess is more likely right
than `defaultValue`.

Detection runs **once**, on the first effect tick, and never again —
a stored choice always beats a navigator guess on later visits.

## `name` — optional, string — defaults to `"locale"`

The `name` attribute on the hidden `<input type="hidden">` that keeps
the control participating in a surrounding `<form>`. There is no
native form control in the markup, so this input is how the selection
reaches a form submission.

```html
<form>
    <lily-locale-select name="ui-locale" ... />
</form>
```

Unlike theme-select's `name`, this one has no second job: locale-select
manages no `<link>` element, so multiple selects on a page do not
collide. Give them distinct `name` values anyway if they submit into
the same form.

## `target` — optional, HTMLElement | null — defaults to `null`

Element that receives `lang` (and, unless `applyDir` is false, `dir`)
on each apply. `null` means `document.documentElement` — i.e.
`<html>`, which is what you want for a whole-page locale switch. Pass
a specific element to scope the locale to a region of the page, such
as a multilingual side panel.

In Angular, resolve the element with a template reference variable
plus a `viewChild()` query:

```ts
import { Component, ElementRef, signal, viewChild } from "@angular/core";
import { LocaleSelect } from "./locale-select.component";

@Component({
    standalone: true,
    imports: [LocaleSelect],
    template: `
        <section #region>
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

A simpler form for trivial scoping is to use the template ref
directly: `[target]="region"` where `region` is the local `#region`
ref — Angular resolves it to the underlying `HTMLElement` at
template-binding time.

Scoping affects the DOM write only. Persistence, the `localeChange`
output, and `value` behave identically whatever the target.

## `applyDir` — optional, boolean — defaults to `true`

When true, each apply writes `dir="rtl"` or `dir="ltr"` to the target
alongside `lang`, choosing between them with
[`isRtlLocale`](#isrtllocale). Set it to `false` when you manage `dir`
yourself — for instance when a framework, a server-rendered shell, or
a CMS already owns the attribute and a second writer would fight it.

```html
<lily-locale-select [applyDir]="false" ... />
```

Turning it off does not disable RTL detection generally: `isRtlLocale`
stays exported and you can call it in your own `dir` logic. What it
changes in the component is exactly one thing — the `dir` write is
skipped. `lang` is still written. See [`rtl.md`](./rtl.md) for what
`dir="rtl"` actually changes on the page.

## `localeLabels` — optional, Record<string, string> — defaults to `{}`

Per-code display label override, consulted first when rendering
option text. When a code is absent from the map, the component falls
back in order to `defaultLocaleLabels` (the built-in 436-row English
name table), then to `Intl.DisplayNames` for the navigator's locale,
then to the raw code.

Use it for endonyms — showing each language in its own language, which
is the usual best practice for a language switcher — or for i18n of
the English defaults.

```ts
const labels = {
    en: "English",
    fr: "Français",
    ar: "العربية",
    he: "עברית",
};
```

```html
<lily-locale-select [localeLabels]="labels" ... />
```

These labels are also what the listbox typeahead matches against, so
localising them localises the typeahead. Endonyms shift what the user
must type: with the default labels, `g` finds German; with
`{ de: "Deutsch" }`, `g` finds nothing and `d` finds it instead.
Decide which language your users will be thinking in when they reach
for the switcher.

## `className` — optional, string — defaults to `""`

Extra CSS class hook on the root `<div>`. Always emitted after
`"locale-select"`, so consumer styles can use either selector.

```html
<lily-locale-select className="my-extra" ... />
```

Renders:

```html
<div class="locale-select my-extra">
```

The `className` input is Angular's equivalent of Vue's
`inheritAttrs: true`-driven `class` fall-through. Angular has no
implicit attribute spread, so the helper exposes an explicit input.

## `localeChange` — output, string

Emits the new code after every successful apply — that is, after
`lang`, `dir`, and storage have been written. The payload is the
**consumer-form** code (`en_US`), not the normalised BCP 47 tag
(`en-US`). Use it to drive an i18n library, analytics, server sync, or
a cookie write.

```html
<lily-locale-select (localeChange)="onLocaleChange($event)" ... />
```

```ts
onLocaleChange(code: string): void {
    this.translate.use(code);
}
```

It also fires for the resolved **initial** locale on mount, not only
for user-driven changes, so a handler that loads message catalogues
works without a separate bootstrap call. Wiring recipes for
`@angular/localize`, Transloco, ngx-translate, and raw `Intl.*` are in
[`i18n-integration.md`](./i18n-integration.md).

## Implicit `valueChange` — output, string

`model<string>()` exposes both a read accessor (`value()`) and an
implicit `valueChange` output. `[(value)]` two-way binding subscribes
to that output automatically. You rarely need to subscribe directly:

```html
<!-- Two-way binding (recommended) -->
<lily-locale-select [(value)]="locale" ... />

<!-- Equivalent explicit form -->
<lily-locale-select
    [value]="locale()"
    (valueChange)="locale.set($event)"
    ...
/>
```

`valueChange` fires when the selection changes; `localeChange` fires
when the selection has been **applied** to the DOM. They are one tick
apart and carry the same string. Prefer `localeChange` for side
effects, `[(value)]` for state.

## Initial-value resolution order

Every input that can supply a starting locale is consulted once, on
the first effect run, in this order. The first non-empty result wins:

| # | Source                                    | Condition                          |
| - | ----------------------------------------- | ---------------------------------- |
| 1 | `value()`                                 | Non-empty string supplied.          |
| 2 | `localStorage.getItem(storageKey)`        | `storageKey` set, read did not throw. |
| 3 | `matchNavigatorLanguage(navLangs, locales)` | `detectFromNavigator` is `true`.  |
| 4 | `defaultValue()`                          | Non-empty string supplied.          |
| 5 | `"en"`                                    | Present in `locales`.               |
| 6 | `locales[0]`                              | Array is non-empty.                 |

If all six come back empty — an empty `locales` array with nothing
else set — no apply happens and no attribute is written.

## Exported helpers and constants

All of these come from the package barrel (`index.ts`) and are safe
to use outside the component.

### `bcp47LocaleTag`

`(locale: string) => string`. Replaces every `_` with `-`. No case
normalisation is applied — `en_us` becomes `en-us`, not `en-US`.

```ts
bcp47LocaleTag("en_US");      // "en-US"
bcp47LocaleTag("zh_Hant_TW"); // "zh-Hant-TW"
bcp47LocaleTag("en");         // "en"
```

### `isRtlLocale`

`(locale: string) => boolean`. True when the locale carries an RTL
script subtag (`Arab`, `Hebr`, `Mong`, `Nkoo`, `Syrc`, `Thaa`,
`Adlm`, case-insensitive, as a `-` or `_` separated component), or
when its leading language subtag is one of the 16 RTL languages.

```ts
isRtlLocale("ar");         // true
isRtlLocale("he_IL");      // true
isRtlLocale("uz_Arab_AF"); // true — script subtag
isRtlLocale("en");         // false
isRtlLocale("");           // false
```

Exported so you can reuse the same decision in your own `dir` logic
when `applyDir` is `false`. Details: [`rtl.md`](./rtl.md).

### `localeName`

`(locale: string) => string`. Resolves a code to its English name via
the built-in table, returning the raw code when there is no entry.
Note this is the **table only** — unlike the component's internal
label resolution, it does not consult `localeLabels` or
`Intl.DisplayNames`.

```ts
localeName("en_US"); // "English (United States)"
localeName("xx");    // "xx"
```

Useful for a status region that names the active locale in text.

### `matchNavigatorLanguage`

`(navLangs: readonly string[], locales: readonly string[]) => string`.
Walks `navLangs` in order and, for each, tries an exact match
(case-insensitive, `-` and `_` equivalent) against `locales`, then a
language-only match on the leading subtag. Returns the matching entry
**in its `locales` form**, or `""` when nothing matches.

```ts
matchNavigatorLanguage(["fr-CH", "en"], ["en", "fr", "de"]); // "fr"
matchNavigatorLanguage(["ja"], ["en", "fr"]);               // ""
```

This is the function `detectFromNavigator` calls. Exported so you can
run the same match server-side against an `Accept-Language` header.

### `defaultLocaleLabels`

`Record<string, string>`. The built-in code → English-name table, 436
entries, generated from `locales.tsv`. Consulted when `localeLabels`
has no entry for a code.

```ts
defaultLocaleLabels["en_US"]; // "English (United States)"
```

### `RTL_LANGUAGE_TAGS`

`Set<string>`. The 16 lowercase language subtags treated as RTL:
`ar`, `arc`, `ckb`, `dv`, `fa`, `he`, `iw`, `ji`, `ks`, `ku`, `mzn`,
`ps`, `sd`, `ug`, `ur`, `yi`.

```ts
RTL_LANGUAGE_TAGS.has("ar"); // true
```

### `RTL_SCRIPT_SUBTAGS`

`Set<string>`. The lowercase RTL script subtags: `arab`, `hebr`,
`mong`, `nkoo`, `syrc`, `thaa`, `adlm`. Membership is tested
case-insensitively by `isRtlLocale`, so the set stores lowercase keys.

### `GLOBE_WITH_MERIDIANS`

`string`. The default button glyph: U+1F310 GLOBE WITH MERIDIANS
followed by U+FE0E VARIATION SELECTOR-15. VS15 requests *text*
presentation — without it the browser picks the colour-emoji font and
the globe renders blue, which would not match theme-select's
monochrome glyph when the two controls sit side by side in a page
header.

```ts
GLOBE_WITH_MERIDIANS; // "\u{1F310}︎"
```

Exported so you can reuse the exact glyph in a custom icon template.

### `nextLocaleSelectId`

`() => string`. Increments a module-scoped counter and returns
`locale-select-{n}`. The component calls it once per instance to build
its base id; the list becomes `{base}-list` and option *i* becomes
`{base}-option-{i}`.

It is deliberately **not** `Math.random()` or `Date.now()`: server and
client must produce the same ids or hydration mismatches. Details:
[`ssr.md`](./ssr.md).

### `LocaleSelectIcon`

Optional standalone marker directive, selector
`ng-template[lilyLocaleSelectIcon]`. It exists only to give consumers
typed `let-` variables under `strictTemplates` — the component queries
*any* projected `<ng-template>` via `contentChild(TemplateRef)`, so
the marker is never required for matching.

```html
<lily-locale-select label="Language" [locales]="locales" [(value)]="locale">
    <ng-template lilyLocaleSelectIcon let-args>
        <span [attr.data-open]="args.open">{{ args.value }}</span>
    </ng-template>
</lily-locale-select>
```

### `ChildArgs`

Type-only export. The context object passed to a projected icon
`<ng-template>`, supplied both as `$implicit` and as named properties.

| Key        | Type                         | Meaning                                        |
| ---------- | ---------------------------- | ---------------------------------------------- |
| `value`    | `string`                     | Selected locale code, consumer form.            |
| `open`     | `boolean`                    | Is the listbox open?                            |
| `labelFor` | `(locale: string) => string` | Resolve a code to its display label.            |

## Content projection — the icon `<ng-template>`

Not an input, but part of the public surface. A projected
`<ng-template>` replaces the default globe glyph inside the trigger
button:

```html
<lily-locale-select label="Language" [locales]="locales">
    <ng-template let-args>{{ args.labelFor(args.value) }}</ng-template>
</lily-locale-select>
```

The template replaces the **glyph only**; it does not render options,
and the listbox stays component-owned. When it is supplied, the
`.locale-select-icon` span is absent from the DOM entirely.

## Related

- [`concepts.md`](./concepts.md) — mental model and lifecycle.
- [`accessibility.md`](./accessibility.md) — the icon-only button,
  the custom listbox, the status-region pattern.
- [`bcp47.md`](./bcp47.md) — language-tag syntax and subtags.
- [`rtl.md`](./rtl.md) — RTL detection and what `dir` changes.
- [`ssr.md`](./ssr.md) — server-resolved initial value, hydration.
- [`i18n-integration.md`](./i18n-integration.md) — wiring the
  `localeChange` output to an i18n library.
- [`../spec/index.md`](../spec/index.md) — the canonical contract.

---

Lily™ and Lily Design System™ are trademarks.

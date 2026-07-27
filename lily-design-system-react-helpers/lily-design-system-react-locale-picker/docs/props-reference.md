# Props reference

Field-by-field reference for every public prop. The contract is owned
by [`../spec/index.md`](../spec/index.md) §4; this file expands the
rationale and common usage.

## `label` — required, string

`aria-label` on both the trigger `<button>` and the `<ul
role="listbox">`. Always supplied, always translatable.

```tsx
<LocaleChooser label="Language" locales={locales} />
<LocaleChooser label="Langue" locales={locales} />
<LocaleChooser label="اللغة" locales={locales} />
```

This prop carries the whole accessible name: the button holds only an
`aria-hidden` globe glyph, so without `label` the control is announced
as an unnamed button. See [accessibility.md](./accessibility.md).

A note specific to this control: `label` should be written in the
language the user is *currently* reading, not in the language they
might switch to. A common pattern is to translate it alongside the rest
of your UI copy — see [i18n-integration.md](./i18n-integration.md).

## `locales` — required, string[]

The locale codes the control exposes as options — one
`<li role="option">` each, in array order. Codes may be written in
either underscore (`en_US`) or hyphen (`en-US`) form; the component
normalises to BCP 47 hyphen form when it writes `lang`, and keeps your
original form as the value it hands back to `onChange`.

```tsx
// Both forms work; pick one and stay consistent.
locales={["en", "en_US", "fr_CA", "ar"]}
locales={["en", "en-US", "fr-CA", "ar"]}
```

Order is yours to choose and is not sorted for you. Two conventions
that both test well:

- **Frequency order** — your most-used locales first, everything else
  alphabetical after. Best for short lists.
- **Endonym-alphabetical** — sorted by the name as written in its own
  language. Best for long lists, because it matches what the user
  reads. Combine with the built-in typeahead (see
  [`../examples/all-locales.tsx`](../examples/all-locales.tsx)).

Do not sort by the *code*: `de` before `el` before `en` is meaningless
to a reader scanning "Deutsch / Ελληνικά / English".

## `value` — optional, string

The active locale code. When supplied, the component is **controlled** —
you own the state and must update it from `onChange`.

When omitted, the component is **uncontrolled** — internal state seeds
from `storageKey` / `detectFromNavigator` / `defaultValue` / `"en"` /
`locales[0]`, in that order.

```tsx
// Controlled — required if anything else in your app reads the locale.
const [locale, setLocale] = useState("");
<LocaleChooser value={locale} onChange={setLocale} label="Language" locales={locales} />

// Uncontrolled — fine when the DOM `lang`/`dir` is the only consumer.
<LocaleChooser defaultValue="fr" label="Language" locales={locales} />
```

Controlled is the common case here, because a locale change usually has
to drive a translation library too. See
[i18n-integration.md](./i18n-integration.md).

## `defaultValue` — optional, string

The initial locale when there is no `value` and nothing in storage or
the navigator. Ignored entirely once the user has picked something and
`storageKey` is set.

If omitted, the component falls back to `"en"` when `"en"` is in
`locales`, and otherwise to `locales[0]`. That `"en"` preference is a
deliberate, documented default rather than a neutral one; pass
`defaultValue` explicitly if your audience's baseline is a different
language.

## `storageKey` — optional, string

When set, the selection is written to `localStorage[storageKey]` on
every change and read back on first mount.

```tsx
<LocaleChooser storageKey="my-app:locale" label="Language" locales={locales} />
```

Namespace the key (`app:locale`) so two apps on the same origin do not
collide. All storage access is wrapped in `try` / `catch`, so Safari
private mode and blocked-cookie settings degrade to "no persistence"
rather than throwing.

Storage **beats** navigator detection: an explicit past choice outranks
a browser preference. It does **not** beat `value`.

## `detectFromNavigator` — optional, boolean, default `false`

On first visit only — no `value`, nothing in storage — resolve
`navigator.languages` against `locales` and use the best match.

```tsx
<LocaleChooser
    detectFromNavigator
    storageKey="my-app:locale"
    label="Language"
    locales={["en", "fr", "de"]}
/>
```

Matching is two-pass, via the exported `matchNavigatorLanguage`: an
exact match first (treating `-` and `_` as equivalent), then a
language-only match, so a browser set to `fr-CA` lands on `fr` if
`fr-CA` is not offered. Returns `""` when nothing matches, and the
resolution falls through to `defaultValue`.

Off by default, because auto-switching languages surprises users who
share a machine or travel. Opt in when you have a genuinely global
audience.

## `name` — optional, string, default `"locale"`

The `name` of the hidden input that carries the active code, so the
locale submits with a surrounding `<form>`.

```html
<input type="hidden" name="locale" value="fr_CA" />
```

Give each instance a distinct `name` when a page has more than one
control — see [`../examples/scoped-target.tsx`](../examples/scoped-target.tsx).

## `target` — optional, `HTMLElement | null`, default `document.documentElement`

The element that receives `lang` and `dir`. The default is `<html>`,
which is what WCAG 3.1.1 (Language of Page) asks for.

Pass an element to scope the change to one region instead — a
multilingual card, a preview pane, a comment thread:

```tsx
const panelRef = useRef<HTMLDivElement>(null);
<div ref={panelRef}>
    <LocaleChooser target={panelRef.current} label="Language" locales={locales} />
</div>
```

Scoping to a region satisfies WCAG 3.1.2 (Language of Parts) rather
than 3.1.1. It does not replace setting a page language — do both.

## `applyDir` — optional, boolean, default `true`

When true, the control writes `dir="rtl"` or `dir="ltr"` alongside
`lang`, using the exported `isRtlLocale` predicate.

Set it to `false` when your layout owns direction itself — for example
when a framework router already writes `dir`, or when you deliberately
keep an LTR chrome around RTL content:

```tsx
<LocaleChooser applyDir={false} label="Language" locales={locales} />
```

`lang` is still written. See [rtl.md](./rtl.md) for what flips and what
does not.

## `localeLabels` — optional, `Record<string, string>`, default `{}`

Per-code label overrides. Without it, the component resolves a label in
this order: `localeLabels` → the built-in 436-row table from
`locales.tsv` → `Intl.DisplayNames` → the raw code.

```tsx
<LocaleChooser
    localeLabels={{ en: "English", fr: "Français", "pt_BR": "Português (Brasil)" }}
    label="Language"
    locales={["en", "fr", "pt_BR"]}
/>
```

Use it to switch from English exonyms ("German") to endonyms
("Deutsch"), which is the accessible default for a language picker: a
user who only reads German cannot find "German" in a list.

## `children` — optional, `(args: ChildArgs) => React.ReactNode`

A render prop that **replaces the glyph inside the button**. It does
not render the options — the component owns those, along with the whole
keyboard contract.

```tsx
<LocaleChooser label="Language" locales={locales}>
    {({ value, open, labelFor }) => (
        <span aria-hidden="true">{labelFor(value)} {open ? "▲" : "▼"}</span>
    )}
</LocaleChooser>
```

See [custom-rendering.md](./custom-rendering.md) for the full contract.

## `onChange` — optional, `(locale: string) => void`

Fires after the control has applied the locale to the DOM and written
storage. The argument is the code in **your** form, not the normalised
BCP 47 tag — if you passed `en_US`, you get `en_US` back. Use the
exported `bcp47LocaleTag` when you need the hyphen form.

```tsx
<LocaleChooser
    onChange={(code) => i18n.changeLanguage(bcp47LocaleTag(code))}
    label="Language"
    locales={locales}
/>
```

It fires on the initial resolution too, not only on user interaction,
so a listener that swaps translation bundles stays in step on first
paint.

## `className` — optional, string, default `""`

Appended to the root's `locale-chooser` class hook, giving
`class="locale-chooser your-class"`. The base hook is never replaced.
See [styling.md](./styling.md).

## `...restProps`

Every other prop spreads onto the root `<div>` — `id`, `data-*`,
`style`, event handlers, `aria-*` overrides. Nothing is filtered.

```tsx
<LocaleChooser
    id="site-locale"
    data-testid="locale"
    label="Language"
    locales={locales}
/>
```

---

Lily™ and Lily Design System™ are trademarks.

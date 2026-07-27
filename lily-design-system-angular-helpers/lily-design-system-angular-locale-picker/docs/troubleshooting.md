# Troubleshooting

Symptoms, root causes, and fixes for the most common problems.

## "Opening the list pushes the rest of the page down"

**Cause.** The package ships zero CSS, and the `<ul class="locale-chooser-list">`
is an ordinary block element in normal document flow until you take it out.

**Fix.** `position: relative` on `.locale-chooser`, `position: absolute` on
`.locale-chooser-list`. Full recipe in [styling.md](./styling.md).

## "The list never closes"

**Cause.** An unconditional `display` rule —
`.locale-chooser-list { display: block }` — overrides the `hidden` attribute
the component toggles.

**Fix.** Scope it: `.locale-chooser-list:not([hidden]) { display: block }`.

## "Nothing on the page is translated when I change the locale"

Working as specified, and the single most common misunderstanding about this
helper.

**Cause.** `LocaleChooser` is not a translation library. `applyLocale` writes
exactly two attributes — `lang` (always) and `dir` (unless `applyDir` is
`false`) — persists the code, and emits `localeChange`. It never touches your
copy, because it has no message catalogue and no opinion about which one you
use.

**Fix.** Wire `(localeChange)` into whatever owns your strings —
`@angular/localize`, Transloco, ngx-translate, or raw `Intl.*`. Each is worked
through in [i18n-integration.md](./i18n-integration.md), with runnable
examples in [with-transloco.component.ts](../examples/with-transloco.component.ts)
and [with-ngx-translate.component.ts](../examples/with-ngx-translate.component.ts).

The division of labour is the subject of
[concepts.md](./concepts.md#three-orthogonal-concerns): *selection* (this
helper), *application* (`lang` / `dir`, also this helper), and *translation*
(yours).

## "`[(value)]` errors, or never updates"

**Cause 1.** The bound field is a plain string. `[(value)]` desugars to
`[value]="x"` + `(valueChange)="x = $event"`, and `value` is a `model<string>()`,
so the consumer side must be a writable signal.

**Fix.**

```ts
locale = signal<string>("");
```

```html
<lily-locale-chooser label="Language" [locales]="locales" [(value)]="locale" />
```

**Cause 2.** The wrong name. The bindable is `value`, not `locale` or
`modelValue`. `(localeChange)` is a separate *notification* output that fires
after the DOM has been written — it is not half of the two-way binding, and
binding to it instead of `[(value)]` gives you a read-only view.

## "My stored locale is ignored on load"

**Cause.** An explicit `value` beats storage. The initialiser resolves, in
order:

1. `value` (if non-empty)
2. `localStorage[storageKey]`
3. `navigator.languages`, if `detectFromNavigator` is `true`
4. `defaultValue`
5. `"en"`, if it is in `locales`
6. `locales[0]`

If you pass `[value]="'en'"` as a "default", you have not set a default — you
have pinned the locale and disabled every step below it.

**Fix.** Leave `value` empty and use `defaultValue` for the fallback:

```html
<lily-locale-chooser
  label="Language"
  [locales]="locales"
  defaultValue="en"
  storageKey="lily-locale"
/>
```

The one legitimate reason to pass `value` explicitly is a server-resolved
locale — see the SSR entry below.

## "`detectFromNavigator` does nothing"

**Cause.** It sits at step 3 of the list above, so it only runs when there is
no explicit `value` *and* nothing in storage. Once a visitor has picked a
locale even once, the stored value shadows the browser preference forever —
which is the point: an explicit choice outranks a guess.

**Also possible.** `matchNavigatorLanguage` found no candidate. It tries an
exact match first (treating `-` and `_` as equivalent, case-insensitively),
then a language-only match. `navigator.languages` of `["de-AT"]` against
`locales` of `["en", "fr"]` matches nothing and returns `""`, and resolution
falls through to `defaultValue`.

**Fix (to test it).** Clear the key, then reload:

```js
localStorage.removeItem("lily-locale");
```

## "The layout does not flip for Arabic or Hebrew"

**Cause 1.** `applyDir` is `false`, so the component wrote `lang` and left
`dir` alone deliberately.

**Cause 2 (far more likely).** `dir="rtl"` *is* on the element, but your CSS
uses physical properties. `margin-left`, `padding-right`, `left`, and
`text-align: left` mean the same thing in both directions; the browser cannot
mirror them for you.

**Fix.** Use logical properties — `margin-inline-start`, `padding-inline-end`,
`inset-inline-start`, `text-align: start`. The full conversion table, the
listbox-positioning case, and what `dir="rtl"` does and does not change are in
[rtl.md](./rtl.md#authoring-css-that-survives-both-directions), demonstrated by
[rtl-demo.component.ts](../examples/rtl-demo.component.ts).

**Cause 3.** You are using `target` to scope the writes to a subtree, and the
CSS you expect to flip lives outside it. `dir` only affects the element it is
set on and its descendants. See
[scoped-target.component.ts](../examples/scoped-target.component.ts).

## "A locale shows the raw code instead of a name"

**Cause.** Label resolution is a four-step fallback:

1. `localeLabels[code]` — your override map
2. `defaultLocaleLabels[code]` — the built-in 436-row table
3. `Intl.DisplayNames` — the runtime's own name for the tag
4. the code itself, unchanged

Reaching step 4 means all three lookups missed.

**Most common reason: underscore vs hyphen.** The built-in table is keyed in
the underscore form (`pt_BR`, `zh_Hans`, `en_GB`). Passing `"pt-BR"` in
`locales` misses step 2 entirely and lands on `Intl.DisplayNames`, which
answers in the *user's* language, not English — so the label silently changes
identity depending on who is looking.

**Fix.** Either use the underscore form in `locales`, or state the label
outright:

```ts
localeLabels = { "pt-BR": "Português (Brasil)" };
```

Note that this affects labels only. `bcp47LocaleTag` normalises `_` to `-`
before anything is written to the DOM, so `lang` is correct either way.
Background: [bcp47.md](./bcp47.md#underscore-vs-hyphen).

## "Typeahead can't find the locale I'm typing"

**Cause.** The typeahead matches the **display label**, not the code. With
`localeLabels: { de: "Deutsch" }`, typing `g` for "German" finds nothing —
type `d`. The buffer also clears after a 500 ms pause, so slow typing restarts
the search on each character.

## "The wrong locale flashes before hydration"

**Cause.** The server rendered with an empty `value`, so it wrote nothing;
the client then resolved a locale from `localStorage` or `navigator` and
applied it after hydration. The gap between the two is your flash.

**Fix.** Resolve the locale on the server — cookie, `Accept-Language` header,
or URL prefix — and pass it in as `value`, so both renders start from the same
answer. [ssr.md](./ssr.md) covers all four strategies;
[analog-cookie.component.ts](../examples/analog-cookie.component.ts) is the
recommended Analog v1 version.

## "Hydration mismatch (NG0500)"

**Probably not the ids.** `nextLocaleChooserId()` is a module-scoped counter,
not `Math.random()` or `Date.now()`, so `id`, `aria-controls`, and every
option id match across server and client — *provided both instantiate the same
components in the same order*. A component that renders only on the client, or
only on the server, shifts the counter and desynchronises every id after it.

**More likely, the value-derived attributes.** The hidden input's `value`, the
`aria-selected` flags, and the option text all follow the resolved locale, so
they differ whenever the server rendered from an empty `value` and the client
resolved a real one.

**Fix.** Same as the previous entry: resolve server-side and pass `value`.
See [ssr.md](./ssr.md#hydration-considerations).

## "The locale doesn't persist in private browsing"

Working as specified. Both `localStorage` calls are wrapped in `try`/`catch`
and swallow the error — Safari private mode, blocked third-party storage, and
quota exhaustion all make the write throw, and the component treats persistence
as best-effort rather than letting a storage failure break locale switching.

**Diagnosis.** If persistence is failing silently and you want to know, test
storage yourself rather than expecting the component to report it:

```ts
try {
  localStorage.setItem("__probe", "1");
  localStorage.removeItem("__probe");
} catch {
  // fall back to a cookie; see docs/ssr.md
}
```

A cookie is the durable alternative, and it has the additional advantage of
reaching the server — which is what makes the SSR strategies work.

**Also check.** `storageKey` is actually set. It defaults to `""`, which
disables persistence entirely; there is no implicit key.

## "The globe renders blue, as a colour emoji"

**Cause.** `GLOBE_WITH_MERIDIANS` is two code points: U+1F310 GLOBE WITH
MERIDIANS followed by U+FE0E VARIATION SELECTOR-15, which requests *text*
presentation so the glyph stays monochrome next to theme-chooser's `◑`. The
colour emoji comes back when the variation selector stops having an effect —
usually because a build step, sanitiser, or copy-paste through a tool that
normalises Unicode has stripped it, or because the consumer font stack has no
text-presentation glyph for U+1F310 and the browser falls back to the colour
emoji font.

**Fix.** Confirm the character survived — `GLOBE_WITH_MERIDIANS.length` is `3`
(the astral glyph is a surrogate pair, plus VS15); a length of `2` means the
selector is gone. Then set a font stack on `.locale-chooser-icon` that includes
a text-presentation face, or sidestep the question entirely with an inline SVG
via a projected `<ng-template>`. Both are covered in
[styling.md](./styling.md) and
[custom-rendering.md](./custom-rendering.md).

## "The button renders an empty box, or a □"

Same root cause as above, opposite failure: the device has no glyph for
U+1F310 at all. Give `.locale-chooser-button` a `min-width` and `min-height` so
it stays a hittable target regardless, and consider replacing the glyph.

The accessible name is unaffected either way — the span is `aria-hidden` and
the button is named by `aria-label`.

## "Screen readers announce two language controls"

**Cause.** A second, visually hidden language widget is still in the
accessibility tree. `.sr-only` clip recipes — `position: absolute; clip-path:
inset(50%)` and friends — deliberately keep their content *available* to
assistive technology; that is what they are for. Hiding a duplicate that way
hides it from sighted users only.

**Fix.** Remove the duplicate outright, or hide it with `display: none` /
`[hidden]` / `aria-hidden="true"`, which do take it out of the tree. Reserve
`.sr-only` for text that has no visual equivalent — the status region in
[accessibility.md](./accessibility.md#the-status-region-is-part-of-the-pattern)
is the canonical legitimate use.

## "The button doesn't announce which locale is active"

By design. The closed button is icon-only and its glyph is `aria-hidden`, so
`aria-label` is its entire accessible name and it is deliberately constant —
a label that changed with the selection would make the control's *purpose*
unannounceable.

**Fix.** Pair the select with a polite live region driven by
`(localeChange)`, which is exactly what that output exists for. The pattern,
its rationale, and its limits are in
[accessibility.md](./accessibility.md#the-status-region-is-part-of-the-pattern).

If you would rather show the active locale in the trigger, project a template —
the context gives you `value` and `labelFor` — but treat that as a visual
affordance and keep the status region for the announcement. See
[custom-rendering.md](./custom-rendering.md).

## "Two selects fight over `<html lang>`"

When two instances both default their `target` to `document.documentElement`,
the last apply wins, and the loser's `value` still shows its own selection —
the UI and the DOM disagree.

**Fix.** One global select, and give any others an explicit `target` so they
scope their writes to a subtree. See
[scoped-target.component.ts](../examples/scoped-target.component.ts).

## "Tests fail: `scrollIntoView is not a function`"

**Cause.** jsdom does not implement `scrollIntoView`. Any listbox that scrolls
its active option into view hits this.

**Not from this package.** `scrollActiveIntoView` calls
`el?.scrollIntoView?.({ block: "nearest" })` — optional call, precisely so the
spec runs unpatched under jsdom. If you see this error, it is coming from your
own wrapper or another library in the same test.

**Fix (for that other code).** Stub it once in your test setup:

```ts
Element.prototype.scrollIntoView = () => {};
```

## "Tests fail: `matchMedia is not defined`"

`LocaleChooser` never calls `matchMedia` — it has no media-query behaviour of
any kind. The call is coming from something else in the test (a sibling
helper, a CDK layout service, or app code). Stub it in setup:

```ts
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }),
});
```

## "`setInput` isn't a method on the instance"

Signal inputs are read-only references, so plain assignment does not work. Go
through the `ComponentRef`, and flush change detection afterwards:

```ts
const fixture = TestBed.createComponent(LocaleChooser);
fixture.componentRef.setInput("label", "Language");
fixture.componentRef.setInput("locales", ["en", "fr", "ar"]);
fixture.detectChanges(); // required under OnPush
```

## "Tests leak locale state between cases"

The component writes to `document.documentElement` and `localStorage`, and
neither is reset by `TestBed`. A case that selects `ar` leaves `dir="rtl"` on
the document for every case after it.

**Fix.** Clear both in `beforeEach`, as the package's own spec does:

```ts
beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("lang");
  document.documentElement.removeAttribute("dir");
});
```

## "`let-args` is `any` in my icon template"

Add the exported `LocaleChooserIcon` marker directive to the `<ng-template>`
and to your component's `imports`:

```html
<ng-template lilyLocaleChooserIcon let-args>{{ args.labelFor(args.value) }}</ng-template>
```

Its `ngTemplateContextGuard` types the context as `ChildArgs` under
`strictTemplates`. It changes nothing at runtime — the component queries any
projected `<ng-template>` via `contentChild(TemplateRef)`.

## "Arrow keys stop at the ends instead of wrapping"

Working as specified. The APG listbox pattern clamps rather than wraps; `Home`
and `End` are the fast paths to the ends. Note that the *typeahead* does wrap —
it searches forward from the active option and continues past the end — which
is the same asymmetry the APG describes.

## "Changing `locales` or `localeLabels` doesn't re-apply the locale"

By design. The apply effect reads `value()`; other inputs are read *inside*
`applyLocale` but do not trigger it. Since neither input changes what `lang`
or `dir` should be for an unchanged `value`, there is nothing to re-apply —
the option labels re-render on their own through normal change detection.

## "Every option looks highlighted"

**Cause.** `[data-active]` and `[aria-selected="true"]` styled identically.
They are different states: `data-active` is where the keyboard is pointing,
`aria-selected` is the locale in effect. Mid-navigation they sit on different
options.

**Fix.** Distinct treatments — a background for `[data-active]`, a weight
change or checkmark for `[aria-selected="true"]`. See
[styling.md](./styling.md).

## "Keyboard users can't see where they are in the list"

**Cause.** No focus ring on `.locale-chooser-list`. The `<ul>` — not the
options — holds DOM focus for the whole open interaction, and the highlight
moves via `aria-activedescendant`. Without a visible indicator on the list
itself, nothing on screen ties the highlight to the user's keystrokes.

**Fix.** Style `.locale-chooser-list:focus-visible` alongside
`.locale-chooser-button:focus-visible`. See
[accessibility.md](./accessibility.md#keyboard-contract).

---

Still stuck? The canonical contract, clause by clause, is
[spec/index.md](../spec/index.md); the input and output tables are in
[props-reference.md](./props-reference.md); task-shaped solutions are in
[recipes.md](./recipes.md); and the package overview is
[index.md](../index.md).

---

Lily™ and Lily Design System™ are trademarks.

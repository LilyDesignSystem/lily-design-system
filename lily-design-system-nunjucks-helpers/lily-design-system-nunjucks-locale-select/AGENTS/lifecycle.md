# Lifecycle — LocaleSelect (Nunjucks)

The Nunjucks-flavoured walk-through of the select's lifecycle. The
canonical contract is in [`../spec/index.md`](../spec/index.md) §5; this file
maps the Svelte canonical's `$effect` lifecycle to the Nunjucks
macro + client.js split.

## Lifecycle diagram

```
Nunjucks render time
  │
  ▼
localeSelect(opts) macro
  │  emits <select data-lily-locale-select-root …>
  │   with data-lily-locale-select-value = opts.value (if non-empty)
  │   and per-option <option lang="{tagFor(locale)}">.
  │   The placeholder is the ONLY `selected` option — no real option
  │   is ever rendered `selected`, so the closed control reads the
  │   placeholder word from byte zero (no pre-hydration flash).
  │
  ▼
HTML response sent to browser
  │
  ▼
Browser parses HTML, paints static select
  │
  ▼
<script type="module"> imports locale-select.client.js
  │
  ▼
autoInit() finds [data-lily-locale-select-root] in DOM
  │
  ▼
For each root, initLocaleSelect(root) runs:
  1. Read data-lily-* attrs into local vars
  2. Resolve initial code (value attr > storage > navigator > default > "en" > first)
  3. If initial: applyLocale(initial)
  4. Attach change listener at the select
  │
  ▼
applyLocale(code):
  1. target.setAttribute("lang", bcp47LocaleTag(code))
  2. if applyDir: target.setAttribute("dir", isRtlLocale(code) ? "rtl" : "ltr")
  3. if storageKey: localStorage.setItem(storageKey, code)
  4. select.value = ""  // snap back to the placeholder option
  5. opts.onChange?.(code)  // consumer-form code, not BCP 47

User picks an option
  │
  ▼
select fires a "change" event
  │
  ▼
listener reads chosen = select.value
  │
  ▼
select.value = ""          // snap back to the placeholder
  │
  ▼
if (chosen) applyLocale(chosen)  // picking the placeholder is a no-op
```

The snap-back runs synchronously inside the listener, so a consumer's
own `change` listener that reads `event.target.value` will see `""`.
Use `opts.onChange(code)` or read `lang` from the target instead.

## Why a separate "init" and "apply"

`initLocaleSelect` runs once per root; `applyLocale` runs every
time the user changes the selection. The split lets the
controller's `setLocale(code)` reuse the same code path as the
user picking an option — both flow through `applyLocale`.

## Initial-value resolution

Inside `initLocaleSelect(root)`:

```js
const options = readOptions(root);
const optionValues = options.map((o) => o.value);
let initial = "";

// 1. value prop — read from the data attribute the macro emits.
initial = root.getAttribute("data-lily-locale-select-value") || "";

// 2. storage
if (!initial && storageKey) initial = safeStorageGet(storageKey) || "";

// 3. navigator
if (!initial && detectFromNavigator && typeof navigator !== "undefined") {
    const navLangs =
        navigator.languages?.length
            ? Array.from(navigator.languages)
            : navigator.language ? [navigator.language] : [];
    initial = matchNavigatorLanguage(navLangs, optionValues);
}

// 4. default-value
if (!initial && defaultValue) initial = defaultValue;

// 5. "en" if present
if (!initial && optionValues.includes("en")) initial = "en";

// 6. first option
if (!initial && optionValues.length > 0) initial = optionValues[0];

if (initial) applyLocale(initial);
```

The resolution order is documented in
[`../spec/index.md` §5.2](../spec/index.md#52-initial-value-resolution).
Putting the consumer's `value` first means a server-resolved cookie
always wins — important for flicker-free SSR.

`opts.value` is read from the `data-lily-locale-select-value`
attribute, **not** from a `selected` option. The macro deliberately
never renders `selected` on a real option: the placeholder must be the
only selected option in the server HTML, otherwise the browser (which
honours the *last* `selected` option) would paint the locale name and
the client would then snap it back — a visible flash on every load.

## Apply

```js
function applyLocale(code) {
    if (!code) return;
    const target = opts.target || document.documentElement;
    target.setAttribute("lang", bcp47LocaleTag(code));
    if (applyDir) {
        target.setAttribute("dir", isRtlLocale(code) ? "rtl" : "ltr");
    }
    if (storageKey) safeStorageSet(storageKey, code);
    root.value = ""; // snap back to the placeholder option
    if (typeof opts.onChange === "function") opts.onChange(code);
}
```

Two mutations to the DOM (three when `applyDir`), one to storage,
one callback. No intermediate state.

## Why `change` / `onChange` emits the consumer form

The DOM `lang` attribute is normalised to BCP 47 hyphen form
(`en-US`), but the `onChange` callback payload preserves the
consumer's original form (`en_US` if the consumer put `en_US` in
`locales`). This keeps round-trips lossless and lets the
consumer's i18n library — which might use the underscore form
internally — receive the same string it stored.

## SSR (Nunjucks render time)

The macro is the SSR side. It runs deterministically with the
`opts` the consumer supplied — no DOM access, no `localStorage`,
no `navigator`. The macro output goes straight into the HTML
response.

The macro never writes `lang` / `dir` to `<html>`. Those happen
in the client.js on hydration. To avoid a first-paint flash,
write `<html lang="…" dir="…">` in your layout (substituting from
a cookie / header / session) and pass `opts.value`, which the macro
emits as `data-lily-locale-select-value` for the client to pick up.

## Reactivity

The client.js attaches one `change` listener at the `<select>`.
Every option change triggers `applyLocale`. The controller's
`setLocale` does the same. If a consumer mutates a `data-lily-*`
attribute after init, the client.js does **not** re-read it.

## Unmount / cleanup

`controller.destroy()` removes the `change` listener. It does
**not**:

- restore the previous `lang` / `dir`;
- clear the `localStorage` entry;
- reset the `<select>` value to a default.

The select may be unmounted because the user navigated away
from a settings page; the chosen locale should stay applied.

If a consumer wants to fully reset, they do it themselves:

```js
document.documentElement.removeAttribute("lang");
document.documentElement.removeAttribute("dir");
localStorage.removeItem("my-app:locale");
```

This is rare. Most apps want the locale to outlive the select.

## Navigator-detection runs once

`matchNavigatorLanguage` is only called inside
`initLocaleSelect`. The select never re-runs detection mid-
session — the user's choice should win over `navigator.languages`
once expressed. To re-detect (e.g. on a settings reset), call the
exported helper manually and pass the result to
`controller.setLocale(code)`.

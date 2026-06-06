# Lifecycle — LocalePicker (Nunjucks)

The Nunjucks-flavoured walk-through of the picker's lifecycle. The
canonical contract is in [`../spec.md`](../spec.md) §5; this file
maps the Svelte canonical's `$effect` lifecycle to the Nunjucks
macro + client.js split.

## Lifecycle diagram

```
Nunjucks render time
  │
  ▼
localePicker(opts) macro
  │  emits <fieldset data-lily-locale-picker-root …>
  │   with checked radio = opts.value (if non-empty)
  │   and per-option <label lang="{tagFor(locale)}">
  │
  ▼
HTML response sent to browser
  │
  ▼
Browser parses HTML, paints static fieldset
  │
  ▼
<script type="module"> imports locale-picker.client.js
  │
  ▼
autoInit() finds [data-lily-locale-picker-root] in DOM
  │
  ▼
For each root, initLocalePicker(root) runs:
  1. Read data-lily-* attrs into local vars
  2. Resolve initial code (checked > storage > navigator > default > "en" > first)
  3. If initial: applyLocale(initial)
  4. Attach change listener at the fieldset
  │
  ▼
applyLocale(code):
  1. target.setAttribute("lang", bcp47LocaleTag(code))
  2. if applyDir: target.setAttribute("dir", isRtlLocale(code) ? "rtl" : "ltr")
  3. if storageKey: localStorage.setItem(storageKey, code)
  4. mirror checked state on every radio in the group
  5. opts.onChange?.(code)  // consumer-form code, not BCP 47

User clicks a radio
  │
  ▼
fieldset receives bubbled "change" event
  │
  ▼
listener inspects e.target → input.type === "radio"
  │
  ▼
applyLocale(e.target.value)
```

## Why a separate "init" and "apply"

`initLocalePicker` runs once per root; `applyLocale` runs every
time the user changes the selection. The split lets the
controller's `setLocale(code)` reuse the same code path as a
radio click — both flow through `applyLocale`.

## Initial-value resolution

Inside `initLocalePicker(root)`:

```js
const radios = readRadios(root);
const radioValues = radios.map((r) => r.value);
let initial = "";

// 1. value prop — rendered as `checked` by the macro.
const checked = radios.find((r) => r.checked);
if (checked) initial = checked.value;

// 2. storage
if (!initial && storageKey) initial = safeStorageGet(storageKey) || "";

// 3. navigator
if (!initial && detectFromNavigator && typeof navigator !== "undefined") {
    const navLangs =
        navigator.languages?.length
            ? Array.from(navigator.languages)
            : navigator.language ? [navigator.language] : [];
    initial = matchNavigatorLanguage(navLangs, radioValues);
}

// 4. default-value
if (!initial && defaultValue) initial = defaultValue;

// 5. "en" if present
if (!initial && radioValues.includes("en")) initial = "en";

// 6. first radio
if (!initial && radioValues.length > 0) initial = radioValues[0];

if (initial) applyLocale(initial);
```

The resolution order is documented in
[`../spec.md` §5.2](../spec.md#52-initial-value-resolution).
Putting `checked` (consumer's `value`) first means a server-
resolved cookie always wins — important for flicker-free SSR.

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
    const radios = readRadios(root);
    for (const r of radios) r.checked = r.value === code;
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
a cookie / header / session) and pass `opts.value` so the
matching radio is `checked`.

## Reactivity

The client.js attaches one `change` listener at the fieldset.
Every radio change triggers `applyLocale`. The controller's
`setLocale` does the same. If a consumer mutates a `data-lily-*`
attribute after init, the client.js does **not** re-read it.

## Unmount / cleanup

`controller.destroy()` removes the `change` listener. It does
**not**:

- restore the previous `lang` / `dir`;
- clear the `localStorage` entry;
- re-render the radio checked state to a default.

The picker may be unmounted because the user navigated away
from a settings page; the chosen locale should stay applied.

If a consumer wants to fully reset, they do it themselves:

```js
document.documentElement.removeAttribute("lang");
document.documentElement.removeAttribute("dir");
localStorage.removeItem("my-app:locale");
```

This is rare. Most apps want the locale to outlive the picker.

## Navigator-detection runs once

`matchNavigatorLanguage` is only called inside
`initLocalePicker`. The picker never re-runs detection mid-
session — the user's choice should win over `navigator.languages`
once expressed. To re-detect (e.g. on a settings reset), call the
exported helper manually and pass the result to
`controller.setLocale(code)`.

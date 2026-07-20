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
  │  emits <div data-lily-locale-select-root …> containing
  │   a hidden input, a trigger <button>, and a <ul role="listbox" hidden>
  │   with data-lily-locale-select-value = opts.value (if non-empty)
  │   and per-option <li lang="{tagFor(locale)}">.
  │   Exactly one <li> is aria-selected="true" and the hidden input is
  │   pre-filled with the same code, resolved server-side.
  │
  ▼
HTML response sent to browser
  │
  ▼
Browser parses HTML, paints the collapsed button
  │  (the button is INERT here — nothing opens until the module runs)
  │
  ▼
<script type="module"> imports locale-select.client.js
  │
  ▼
autoInit() finds [data-lily-locale-select-root] in DOM
  │
  ▼
For each root, initLocaleSelect(root) runs:
  1. Query the button, the listbox, the hidden input, the options
  2. Read data-lily-* attrs into local vars
  3. Attach listeners: button click + keydown, list keydown + click,
     root focusout, document click
  4. Resolve initial code (value attr > storage > navigator > default > "en" > first)
  5. If initial: applyLocale(initial)
  │
  ▼
applyLocale(code):
  1. target.setAttribute("lang", bcp47LocaleTag(code))
  2. if applyDir: target.setAttribute("dir", isRtlLocale(code) ? "rtl" : "ltr")
  3. if storageKey: localStorage.setItem(storageKey, code)
  4. hiddenInput.value = code        // form participation
  5. aria-selected="true" on the matching <li>, "false" on the rest
  6. opts.onChange?.(code)  // consumer-form code, not BCP 47

User opens the listbox (click, Enter, Space, ArrowDown, ArrowUp)
  │
  ▼
openList(startIndex?):
  list.hidden = false; button aria-expanded = "true";
  active option = startIndex ?? the selected one ?? 0;
  focus moves to the <ul>, active option conveyed via aria-activedescendant
  │
  ▼
User moves (Arrow / Home / End / typeahead) — active option only,
nothing is applied yet
  │
  ▼
User commits (Enter, Space, or click on an <li>)
  │
  ▼
choose(index): applyLocale(values[index]); closeList()
  │
  ▼
closeList(refocus = true):
  list.hidden = true; button aria-expanded = "false";
  active option cleared; focus returns to the button
```

Escape, Tab, an outside click, and focus leaving the root all close
without applying anything. Escape refocuses the button; Tab, the
outside click, and the `focusout` path close with `refocus = false`,
so focus keeps moving where the user sent it.

## Why a separate "init" and "apply"

`initLocaleSelect` runs once per root; `applyLocale` runs every
time the user commits a selection. The split lets the
controller's `setLocale(code)` reuse the same code path as the
user picking an option — both flow through `applyLocale`.

Moving the active option is deliberately *not* applying it: arrowing
through the listbox changes only `aria-activedescendant` and
`data-active`. Nothing touches `lang`, `dir`, storage, the hidden
input, or `onChange` until Enter, Space, or a click commits.

## Initial-value resolution

Inside `initLocaleSelect(root)`:

```js
const options = Array.from(list.querySelectorAll('[role="option"]'));
const optionValues = options.map((o) => o.getAttribute("data-value") || "");
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
attribute, **not** from the server-marked `aria-selected` option. The
macro marks one option selected so the pre-hydration markup is
coherent, but the client re-resolves from scratch: storage and
`navigator` are client-only signals the macro could not have seen.
When they disagree, the client's resolution wins and it rewrites
`aria-selected` and the hidden input to match.

## Apply

```js
function applyLocale(code) {
    if (!code) return;
    current = code;
    const target = opts.target || document.documentElement;
    target.setAttribute("lang", bcp47LocaleTag(code));
    if (applyDir) {
        target.setAttribute("dir", isRtlLocale(code) ? "rtl" : "ltr");
    }
    if (storageKey) safeStorageSet(storageKey, code);
    if (input) input.value = code;
    options.forEach((o, i) => {
        o.setAttribute("aria-selected", values[i] === code ? "true" : "false");
    });
    if (typeof opts.onChange === "function") opts.onChange(code);
}
```

Two mutations on the target (three when `applyDir`), one to storage,
one to the hidden input, one `aria-selected` sweep, one callback. No
intermediate state.

## Why `onChange` emits the consumer form

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

The server markup is **not** fully usable on its own. The button has
no behaviour until the client module runs: the listbox stays
`hidden`, and there is no unenhanced fallback for opening it. This is
a genuine regression from the earlier native `<select>`, which the
browser operated with no JS at all. The only no-JS affordance left is
the hidden input, pre-filled server-side, so a form submitted without
JS still carries the resolved locale. Say so plainly to consumers who
must support script-off users.

## Reactivity

The client.js attaches listeners on the button (click, keydown), the
listbox (keydown, click), the root (`focusout`), and `document`
(click, for outside-dismissal). Committing an option triggers
`applyLocale`; the controller's `setLocale` does the same. If a
consumer mutates a `data-lily-*` attribute after init, the client.js
does **not** re-read it.

## Unmount / cleanup

`controller.destroy()` removes every listener it attached and clears
the pending typeahead timer. It does **not**:

- restore the previous `lang` / `dir`;
- clear the `localStorage` entry;
- reset the hidden input or `aria-selected` to a default;
- close an open listbox.

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

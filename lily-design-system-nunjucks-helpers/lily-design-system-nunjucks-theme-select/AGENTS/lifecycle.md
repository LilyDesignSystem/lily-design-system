# Lifecycle — ThemeSelect (Nunjucks)

The Nunjucks-flavoured walk-through of the picker's lifecycle. The
canonical contract is in [`../spec.md`](../spec.md) §5; this file
maps the Svelte canonical's `$effect` lifecycle to the Nunjucks
macro + client.js split.

## Lifecycle diagram

```
Nunjucks render time
  │
  ▼
themeSelect(opts) macro
  │  emits <select data-lily-theme-select-root …>
  │   with selected option = opts.value (if non-empty)
  │
  ▼
HTML response sent to browser
  │
  ▼
Browser parses HTML, paints static select (no JS yet)
  │
  ▼
<script type="module"> imports theme-select.client.js
  │
  ▼
autoInit() finds [data-lily-theme-select-root] in DOM
  │
  ▼
For each root, initThemeSelect(root) runs:
  1. Read data-lily-* attrs into local vars
  2. Resolve initial slug (storage > selected > default-value > "light" > first)
  3. If initial: applyTheme(initial)
  4. Attach change listener on the select
  │
  ▼
applyTheme(slug):
  1. getManagedLink(name).href = themeHref(themesUrl, slug, extension)
  2. (target ?? <html>).setAttribute("data-theme", slug)
  3. if storageKey: localStorage.setItem(storageKey, slug)
  4. set the select value to the matching option
  5. opts.onChange?.(slug)

User changes the select
  │
  ▼
select fires a "change" event
  │
  ▼
listener reads e.target.value
  │
  ▼
applyTheme(e.target.value)
```

## Why a separate "init" and "apply"

`initThemeSelect` runs once per root; `applyTheme` runs every time
the user changes the selection. The split lets the controller's
`setTheme(slug)` reuse the same code path as a select change — both
flow through `applyTheme`.

## Initial-value resolution

Inside `initThemeSelect(root)`:

```js
const optionValues = readOptions(root).map((o) => o.value);
let initial = "";
if (storageKey) initial = safeStorageGet(storageKey) || "";
if (!initial) {
    const selected = root.value;
    if (selected) initial = selected;
}
if (!initial && defaultValue) initial = defaultValue;
if (!initial && optionValues.includes("light")) initial = "light";
if (!initial && optionValues.length > 0) initial = optionValues[0];

if (initial) applyTheme(initial);
```

The resolution order is documented in
[`../spec.md` §5.2](../spec.md#52-initial-value-resolution).
Putting storage **first** matters: a user who picked "dark" two
weeks ago should land on "dark" today, even if the consumer
re-rendered the macro with `opts.value = ""` because the cookie
expired. (`root.value` reflects the selected `<option>`.)

## Apply

```js
function applyTheme(slug) {
    if (!slug) return;
    getManagedLink(name).href = themeHref(themesUrl, slug, extension);
    const target = opts.target || document.documentElement;
    target.setAttribute("data-theme", slug);
    if (storageKey) safeStorageSet(storageKey, slug);
    root.value = slug;
    if (typeof opts.onChange === "function") opts.onChange(slug);
}
```

Three mutations to the DOM, one to storage, one callback. No
intermediate state.

## SSR (Nunjucks render time)

The macro is the SSR side. It runs deterministically with the
`opts` the consumer supplied — no DOM access, no `localStorage`,
no globals. The macro output goes straight into the HTML response.

If the consumer pre-resolves the theme on the server (cookie,
header, session store) and passes it as `opts.value`, the macro
renders the matching `<option>` as `selected`. The client.js notices
that on init and runs `applyTheme(value)` once to inject the
`<link>` and set `data-theme`.

If the consumer renders with no `opts.value` and the page is
hydrated with a cached theme from `localStorage`, there's a
one-frame flash before the client.js runs. The fix is to use a
cookie and pass `opts.value`.

## Reactivity

The client.js attaches one `change` listener on the `<select>`.
Every select change triggers `applyTheme`. The controller's
`setTheme` does the same.

There's no separate "watch" — Nunjucks renders once at request
time, and the client.js runs purely event-driven. If a consumer
mutates a `data-lily-*` attribute after init, the client.js does
**not** re-read it. To change `themesUrl` or `extension` at
runtime, the consumer must `destroy()` and `initThemeSelect(root)`
again.

## Unmount / cleanup

`controller.destroy()` removes the `change` listener. It does
**not**:

- remove the managed `<link>` from `<head>`;
- clear `data-theme` from the target;
- clear the `localStorage` entry.

Those are intentional: the picker can be unmounted because the
user navigated away from a settings page; the theme should stay
applied.

If a consumer wants to fully tear down, they do it themselves:

```js
document.head.querySelector('[data-lily-theme-select="theme"]')?.remove();
document.documentElement.removeAttribute("data-theme");
localStorage.removeItem("my-app:theme");
```

This is rare. Most apps want the theme to outlive the picker.

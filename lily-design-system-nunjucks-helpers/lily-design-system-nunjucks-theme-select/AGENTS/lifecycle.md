# Lifecycle — ThemeSelect (Nunjucks)

The Nunjucks-flavoured walk-through of the select's lifecycle. The
canonical contract is in [`../spec/index.md`](../spec/index.md) §5; this file
maps the Svelte canonical's `$effect` lifecycle to the Nunjucks
macro + client.js split.

## Lifecycle diagram

```
Nunjucks render time
  │
  ▼
themeSelect(opts) macro
  │  emits <div data-lily-theme-select-root …> containing
  │   a hidden input, an icon <button aria-expanded="false">,
  │   and a <ul role="listbox" hidden>.
  │  data-lily-theme-select-value = opts.value (if non-empty).
  │  A server-side selected slug is resolved as
  │   value or defaultValue or ("light" if present else themes[0]);
  │   exactly one <li> gets aria-selected="true" and the hidden
  │   input is pre-filled with it.
  │
  ▼
HTML response sent to browser
  │
  ▼
Browser parses HTML, paints the collapsed button (no JS yet).
  The button is INERT at this point: nothing opens the listbox
  until the client.js runs. See ssr.md.
  │
  ▼
<script type="module"> imports theme-select.client.js
  │
  ▼
autoInit() finds [data-lily-theme-select-root] in DOM
  │
  ▼
For each root, initThemeSelect(root) runs:
  1. Read data-lily-* attrs, the options, their data-values and labels
  2. Attach listeners: button click + keydown, list keydown + click,
     root focusout, document click
  3. Resolve initial slug
     (value attr > storage > system detection > default-value > "light" > first)
  4. If initial: applyTheme(initial)
  │
  ▼
applyTheme(slug):
  1. getManagedLink(name).href = themeHref(themesUrl, slug, extension)
  2. (target ?? <html>).setAttribute("data-theme", slug)
  3. if storageKey: localStorage.setItem(storageKey, slug)
  4. input.value = slug                    // form participation
  5. options: aria-selected = (value === slug)
  6. opts.onChange?.(slug)

User opens the listbox (button click, ArrowDown/ArrowUp/Enter/Space)
  │
  ▼
openList(startIndex?):
  list.hidden = false; button aria-expanded = "true";
  setActive(startIndex ?? indexOf(current) ?? 0); list.focus()
  │
  ▼
User moves the active option (Arrow/Home/End/typeahead)
  │  setActive(i): data-active on the <li>, aria-activedescendant on
  │  the <ul>. NOTHING is applied yet.
  ▼
User confirms (Enter / Space / click on an option)
  │
  ▼
choose(index) → applyTheme(values[index]) → closeList()
                                              │
                                              ▼
                          list.hidden = true; aria-expanded = "false";
                          setActive(-1); button.focus()
```

Escape and Tab call `closeList` **without** `applyTheme`, so
dismissing never changes the theme. Escape returns focus to the
button; Tab, outside clicks, and focus leaving the root close
without refocusing, so the browser's own focus handling proceeds.

The active option and the selected option are separate concepts:
`data-active` / `aria-activedescendant` track where the user is in
the list, and `aria-selected` tracks what has actually been applied.
They only converge once the user confirms.

## Why a separate "init" and "apply"

`initThemeSelect` runs once per root; `applyTheme` runs every time a
theme is chosen. The split lets the controller's `setTheme(slug)`
reuse the same code path as a listbox selection — both flow through
`applyTheme`, and neither touches the open/closed state.

## Initial-value resolution

Inside `initThemeSelect(root)`:

```js
// `values` are the options' data-value attributes, in document order.
const valueAttr = root.getAttribute("data-lily-theme-select-value") || "";
let initial = "";
initial = valueAttr;
if (!initial && storageKey) initial = safeStorageGet(storageKey) || "";
if (!initial && detectFromSystem) initial = matchSystemTheme(values);
if (!initial && defaultValue) initial = defaultValue;
if (!initial && values.includes("light")) initial = "light";
if (!initial && values.length > 0) initial = values[0];

if (initial) applyTheme(initial);
```

The resolution order is documented in
[`../spec/index.md` §5.2](../spec/index.md#52-initial-value-resolution).

**`value` comes first, and this is a change.** This helper used to put
storage first, on the argument that "a user who picked dark two weeks
ago should land on dark today". That argument is right about the case
it describes and wrong about which input should win, because it
assumed `opts.value` only ever carries a *default* the consumer
guessed. It does not. In a Nunjucks app, `opts.value` is how a theme
that was **already resolved on the server** — from a cookie, a
session, a signed-in user's stored preference — reaches the page. That
is the whole reason this catalog renders server-side.

Under storage-first, that server-resolved value was silently
overridden by whatever happened to be in `localStorage`. A user who
changed their theme on another device, or whose account preference was
updated server-side, got the stale local value with nothing to explain
it — and the consumer had no way to override short of clearing storage
themselves. Value-first fixes that, and matches every other Lily
helper, including the canonical Svelte one and every locale-select.

The two-weeks-ago user is not harmed by the change: when the consumer
passes no `opts.value`, storage is still the next thing consulted, so
a returning visitor with a saved choice and no server-side theme lands
exactly where they did before. What changed is only which side wins a
genuine *conflict*, and there the explicit server-resolved value
should.

A consumer who really wants storage to outrank a server value can
express it directly — read `localStorage` in their own page script and
pass the result as `opts.value` — which has the merit of being visible
in the calling code rather than buried in a resolution order.

`opts.value` is read from the `data-lily-theme-select-value`
attribute, and that is still its only channel to the client. The
macro's own server-side selected option is a *separate*, narrower
resolution — `value or defaultValue or ("light" if present else
themes[0])` — because storage and `matchMedia` do not exist at render
time. When they disagree, the client wins: it runs `applyTheme` on
init and rewrites `aria-selected` and the hidden input.

## System-preference detection is client-only

`detectFromSystem` slots into the chain between storage and
`defaultValue` — the same position `detectFromNavigator` occupies in
locale-select. It resolves through `matchSystemTheme(values)`, which
reads `matchMedia("(prefers-color-scheme: dark)")` and returns `""` if
the resulting slug is not among the rendered options, or if
`matchMedia` is not available at all.

That guard is load-bearing rather than defensive: there is no
`matchMedia` in a Nunjucks render process, and none in jsdom either.
So the macro never resolves the system preference — it only emits
`data-lily-theme-select-detect-from-system` for the client to act on,
and its server-rendered `aria-selected` stays on the narrower
`value or defaultValue or fallback` chain described above. With
`detectFromSystem` on and no `opts.value`, expect the server markup to
name one theme and the client to apply another; the listbox is closed
and the button inert throughout, so this is never visible as a control
in an inconsistent state. Consumers who need first-paint agreement
must resolve the theme server-side and pass it as `opts.value`.

## Apply

```js
function applyTheme(slug) {
    if (!slug) return;
    current = slug;
    getManagedLink(name).href = themeHref(themesUrl, slug, extension);
    const target = opts.target || document.documentElement;
    target.setAttribute("data-theme", slug);
    if (storageKey) safeStorageSet(storageKey, slug);
    if (input) input.value = slug;
    options.forEach((o, i) =>
        o.setAttribute("aria-selected", values[i] === slug ? "true" : "false"),
    );
    if (typeof opts.onChange === "function") opts.onChange(slug);
}
```

Four mutations to the DOM, one to storage, one callback. No
intermediate state, and no effect on whether the listbox is open.

## SSR (Nunjucks render time)

The macro is the SSR side. It runs deterministically with the
`opts` the consumer supplied — no DOM access, no `localStorage`,
no globals. The macro output goes straight into the HTML response.

If the consumer pre-resolves the theme on the server (cookie,
header, session store) and passes it as `opts.value`, the macro emits
`data-lily-theme-select-value="{value}"` on the root, marks that
theme's `<li>` `aria-selected="true"`, and pre-fills the hidden
input with it. The client.js reads the attribute on init and runs
`applyTheme(value)` once to inject the `<link>` and set
`data-theme`.

If the consumer renders with no `opts.value` and the page is
hydrated with a cached theme from `localStorage`, there's a
one-frame flash before the client.js runs. The fix is to use a
cookie and pass `opts.value`.

What SSR does **not** buy you is a working control. The button is
inert until the client.js runs; the only no-JS affordance in the
server markup is the pre-filled hidden input, which lets an
enclosing form submit carry a theme. Do not describe the
server-rendered output as progressively enhanced beyond that.

## Reactivity

The client.js attaches listeners for the button (`click`,
`keydown`), the listbox (`keydown`, `click`), the root
(`focusout`), and the document (`click`, for outside dismissal).
Every confirmed selection triggers `applyTheme`. The controller's
`setTheme` does the same, without touching open/closed state.

There's no separate "watch" — Nunjucks renders once at request
time, and the client.js runs purely event-driven. If a consumer
mutates a `data-lily-*` attribute after init, the client.js does
**not** re-read it. The option list is likewise snapshotted at init:
adding or removing `<li>`s afterwards is invisible to the runtime.
To change `themesUrl`, `extension`, or the option set at runtime, the
consumer must `destroy()` and `initThemeSelect(root)` again.

## Unmount / cleanup

`controller.destroy()` removes every listener it attached (button,
listbox, root `focusout`, document `click`) and clears the pending
typeahead timer. It does **not**:

- remove the managed `<link>` from `<head>`;
- clear `data-theme` from the target;
- clear the `localStorage` entry.

Those are intentional: the select can be unmounted because the
user navigated away from a settings page; the theme should stay
applied.

If a consumer wants to fully tear down, they do it themselves:

```js
document.head.querySelector('[data-lily-theme-select="theme"]')?.remove();
document.documentElement.removeAttribute("data-theme");
localStorage.removeItem("my-app:theme");
```

This is rare. Most apps want the theme to outlive the select.

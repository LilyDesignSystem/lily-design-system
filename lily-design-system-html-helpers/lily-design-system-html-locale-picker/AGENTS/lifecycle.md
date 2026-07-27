# Lifecycle — `<locale-chooser>` (HTML helper)

The custom-element-flavoured walk-through of the select's
lifecycle. The canonical contract is in [`../spec/index.md`](../spec/index.md)
§5; this file maps the Svelte canonical's `$effect` lifecycle to
the custom-element callbacks.

## Lifecycle diagram

```
parser sees <locale-chooser label="…" locales="…">
  │
  ▼
constructor
  ↳ #baseId = nextLocaleChooserId()   // "locale-chooser-{n}"
  │
  ▼  (per observed attribute)
attributeChangedCallback("locales" | "label" | …, null, "…")
  ↳ this.#locales = parseCsv(value)
  ↳ #render() if isConnected
  │
  ▼
appendChild → connectedCallback:
  ↳ pull initial #locales / #localeLabels from attributes
  ↳ resolve initial value (see §5.2):
       el.value
       > localStorage[storageKey]
       > matchNavigatorLanguage(navigator.languages, locales) if detectFromNavigator
       > defaultValue
       > "en" if present
       > locales[0]
  ↳ if resolved !== current attribute: setAttribute("value", resolved)
  ↳ #render()          — builds div > input[hidden] + button + ul
  ↳ document.addEventListener("click", #onDocumentClick)
  ↳ if value is non-empty: #applyLocale(value)

user opens the list (click, ArrowDown, Enter, Space, ArrowUp)
  │
  ▼
openList(startIndex?):
  ↳ #activeIndex = startIndex ?? (selected index, else 0)
  ↳ #open = true
  ↳ #syncState()       — aria-expanded, hidden, aria-activedescendant, data-active
  ↳ #listEl.focus()    — focus moves to the <ul>, per the APG listbox pattern
  ↳ scroll the active option into view

user picks an option (click, Enter, Space)
  │
  ▼
#choose(index) → this.value = code  →  closeList()
  │
  ▼
attributeChangedCallback("value", oldValue, newValue):
  ↳ #syncState()       — NO rebuild; see "Why value never rebuilds" below
  ↳ #applyLocale(newValue) — only if isConnected

#applyLocale(code):
  1. target = #target ?? document.documentElement
  2. target.setAttribute("lang", bcp47LocaleTag(code))
  3. if applyDir: target.setAttribute("dir", isRtlLocale(code) ? "rtl" : "ltr")
  4. if storageKey: localStorage.setItem(storageKey, code)
  5. dispatchEvent(new CustomEvent("localechange",
       { detail: { locale: code }, bubbles: true, composed: true }))

element removed from document
  │
  ▼
disconnectedCallback:
  ↳ document.removeEventListener("click", #onDocumentClick)
  ↳ clearTimeout(#typeaheadTimer)
  ↳ lang / dir on <html> are left alone (author-managed once written)
```

## Two update paths: rebuild vs. sync

This is the most important thing to know about the element's
reactivity, and it changed with the icon-button + listbox rendering.

| Trigger                                              | Path         | Effect |
| ---------------------------------------------------- | ------------ | ------ |
| `locales`, `locale-labels`, `label`, `name`, `class`  | `#render()`  | Recreates the whole rendered subtree. Closes the list first (`#open = false`, `#activeIndex = -1`), because a rebuild cannot preserve focus inside it. |
| `value`                                               | `#syncState()` | Mutates attributes in place: the hidden input's `value`, `aria-expanded`, `hidden`, `aria-activedescendant`, and each option's `aria-selected` / `data-active`. |
| `openList()` / `closeList()` / arrow keys / typeahead | `#syncState()` | Same in-place mutation. |

### Why `value` never rebuilds

The user selects a locale *while the listbox is open and focused*.
If assigning `this.value` rebuilt the DOM, `replaceChildren()` would
destroy the focused `<ul>` and the element that
`aria-activedescendant` points at, dropping focus to `<body>` and
losing the active descendant mid-interaction. So the `value` branch
of `attributeChangedCallback` calls `#syncState()` only.

`#syncState()` nonetheless rebuilds the button's children by calling
`renderButtonContent()` again — the button is not the focus holder
while the list is open, so refreshing it is safe, and it keeps a
subclass's value- or open-dependent button content current without
any listener. See
[`../docs/custom-rendering.md`](../docs/custom-rendering.md#timing--when-the-hook-re-runs).

## Why `connectedCallback` and not the constructor

The custom-element spec forbids DOM mutation in the constructor.
`connectedCallback` runs after attributes are attached and the
element is in a document tree, so it is the canonical place to:

- Read attributes.
- Resolve the initial value.
- Render children.
- Mutate `document.documentElement.lang` / `dir`.

The constructor does one thing: claim an id prefix via
`nextLocaleChooserId()`. That is pure bookkeeping, not DOM access, so
it is legal there — and doing it once per instance is what keeps
`listId` / `optionId(i)` stable across rebuilds.

## Initial-value resolution

Inside `connectedCallback`:

```ts
#resolveInitialValue(): void {
    let initial = this.value;

    if (!initial && this.storageKey) {
        try {
            initial = localStorage.getItem(this.storageKey) ?? "";
        } catch { /* ignore */ }
    }

    if (!initial && this.detectFromNavigator && typeof navigator !== "undefined") {
        const navLangs =
            navigator.languages && navigator.languages.length > 0
                ? Array.from(navigator.languages)
                : navigator.language
                  ? [navigator.language]
                  : [];
        initial = matchNavigatorLanguage(navLangs, this.#locales);
    }

    if (!initial) {
        initial =
            this.defaultValue ||
            (this.#locales.includes("en") ? "en" : this.#locales[0]) ||
            "";
    }

    if (initial && initial !== this.value) {
        this.setAttribute("value", initial);
    }
}
```

`setAttribute("value", initial)` re-enters
`attributeChangedCallback`, which syncs state and applies. The
re-entrant call is idempotent.

## Apply

```ts
#applyLocale(code: string): void {
    if (typeof document === "undefined" || !code) return;
    const root = this.#target ?? document.documentElement;
    root.setAttribute("lang", bcp47LocaleTag(code));
    if (this.applyDir) {
        root.setAttribute("dir", isRtlLocale(code) ? "rtl" : "ltr");
    }
    if (this.storageKey) {
        try { localStorage.setItem(this.storageKey, code); } catch { /* ignore */ }
    }
    this.dispatchEvent(
        new CustomEvent<LocaleChooserChangeDetail>("localechange", {
            detail: { locale: code },
            bubbles: true,
            composed: true,
        }),
    );
}
```

## Open / close lifecycle

`openList()` and `closeList()` are public, so consumers and
subclasses can drive the list without re-implementing it.

- `openList(startIndex?)` — no-ops when `locales` is empty. Sets the
  active index (explicit `startIndex`, else the selected option, else
  0), flips `#open`, syncs state, moves focus to the `<ul>`, and
  scrolls the active option into view. (`scrollIntoView` is called
  optionally — jsdom does not implement it.)
- `closeList(refocus = true)` — no-ops when already closed. Clears
  the active index, syncs state (which removes
  `aria-activedescendant` and re-hides the list), and returns focus
  to the button unless `refocus` is `false`.

`refocus: false` is used by the two paths where pulling focus back
would be wrong: `Tab` (the user is deliberately leaving) and the
outside-click / focusout handlers (focus already moved elsewhere).

## Document-level listeners

`connectedCallback` registers a `click` listener on `document` that
closes the list when the click lands outside the rendered root;
`disconnectedCallback` removes it. The rendered root also carries a
`focusout` listener that closes the list when focus leaves the
control — it re-checks `document.activeElement` on the next
microtask, because some engines (and jsdom) dispatch `focusout` with
a null `relatedTarget` before the new focus target is committed.

The typeahead timer is also cleared on disconnect.

## Why `localechange` carries the consumer form, not the BCP 47 form

The `lang` attribute on the DOM is normalised to BCP 47 hyphen form,
but the event payload (and the `value` attribute) preserves the
consumer's original form (`en_US` if the consumer put `en_US` in
`locales`). This keeps round-trips lossless and lets the consumer's
i18n library — which might use the underscore form internally —
receive the same string it stored.

## Watch vs the navigator-detection helper

`matchNavigatorLanguage` is only called inside `connectedCallback`.
The select never re-runs detection mid-session — the user's choice
should win over `navigator.languages` once expressed. If a consumer
wants to re-detect (e.g. on a settings reset), they can call the
exported helper manually and write the result to `el.value`.

## SSR

The class file has no top-level DOM access. The barrel guards
`customElements.define` with `typeof customElements !== "undefined"`,
so importing under Node throws no error. `connectedCallback` only
fires when the element is in a document tree, which never happens
in Node.

The id counter is a plain module-level integer, so ids are
deterministic rather than random — a server render and a client
upgrade produce the same sequence.

The static-site-generator recipe for flicker-free first paint is:
pre-render `<html lang="…" dir="…">` and the matching `<locale-chooser
value="…">` host. The select upgrades without changing anything
visible. See [`./ssr.md`](./ssr.md).

## Unmount

The element does not clean up `lang` / `dir` on unmount. The select
may be unmounted because the consumer navigated away from a
settings page; the locale should stay applied. The host-side `lang`
attribute is author-managed once written — neither the select nor
the platform remove it.

If a consumer wants to fully reset on unmount, they can do it
themselves:

```ts
const select = document.querySelector("locale-chooser")!;
document.documentElement.removeAttribute("lang");
document.documentElement.removeAttribute("dir");
select.remove();
```

## Boolean attribute parsing

`detect-from-navigator` and `apply-dir` follow the HTML
boolean-attribute convention with a wrinkle:

- Absent → the documented default (`false` for
  `detect-from-navigator`, `true` for `apply-dir`).
- Present (any value, including `""`) → `true`.
- Present and equal to `"false"` → `false`.

The JS getter returns `boolean`; the setter writes either `""` (for
`true`) or `"false"` (for an explicit opt-out), or removes the
attribute (for the default).

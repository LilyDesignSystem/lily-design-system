# Lifecycle — `<locale-select>` (HTML helper)

The custom-element-flavoured walk-through of the select's
lifecycle. The canonical contract is in [`../spec/index.md`](../spec/index.md)
§5; this file maps the Svelte canonical's `$effect` lifecycle to
the custom-element callbacks.

## Lifecycle diagram

```
parser sees <locale-select label="…" locales="…">
  │
  ▼
constructor (no-op)
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
  ↳ #render()
  ↳ if value is non-empty: #applyLocale(value)

user picks an option
  │
  ▼
select.change → setter writes el.value = newCode
  │
  ▼
attributeChangedCallback("value", oldValue, newValue):
  ↳ #render() — to update which option is selected
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
  ↳ no-op (lang/dir on <html> are author-managed once written)
```

## Why `connectedCallback` and not the constructor

The custom-element spec forbids DOM mutation in the constructor.
`connectedCallback` runs after attributes are attached and the
element is in a document tree, so it is the canonical place to:

- Read attributes.
- Resolve the initial value.
- Render children.
- Mutate `document.documentElement.lang` / `dir`.

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
`attributeChangedCallback`, which renders and applies. The
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
        new CustomEvent<LocaleSelectChangeDetail>("localechange", {
            detail: { locale: code },
            bubbles: true,
            composed: true,
        }),
    );
}
```

## Why `localechange` carries the consumer form, not the BCP 47 form

The `lang` attribute on the DOM is normalised to BCP 47 hyphen form,
but the event payload (and the `value` attribute) preserves the
consumer's original form (`en_US` if the consumer put `en_US` in
`locales`). This keeps round-trips lossless and lets the consumer's
i18n library — which might use the underscore form internally —
receive the same string it stored.

## Reactivity

Only the `value` attribute triggers a re-apply. Other observed
attributes trigger a re-render (when relevant — `locales`,
`locale-labels`, `label`, `name`, `class`) but do not re-apply the
locale. The next user-driven change applies with the updated
attributes.

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

The static-site-generator recipe for flicker-free first paint is:
pre-render `<html lang="…" dir="…">` and the matching `<locale-select
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
const select = document.querySelector("locale-select")!;
select.addEventListener("disconnectedreset", () => {
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
});
// (then) select.remove();
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

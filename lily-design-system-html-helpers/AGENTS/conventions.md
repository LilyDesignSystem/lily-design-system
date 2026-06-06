# Conventions — Lily HTML Helpers

Working rules for every helper in this catalog. The
[shared/](./shared/) files inherit from the Lily-wide
`AGENTS/headless.md`, `internationalization.md`, and `theme.md`; this
file lists the custom-element-specific decisions layered on top.

## File shape per helper

```
lily-design-system-html-<name>/
├── spec.md             ← single source of truth, numbered with §
├── AGENTS.md           ← fast-index pointer for agents
├── AGENTS/             ← per-helper topic agent files
│   ├── api.md
│   ├── lifecycle.md
│   ├── accessibility.md
│   ├── testing.md
│   └── ssr.md
├── CLAUDE.md           ← `@AGENTS.md`
├── index.md            ← comprehensive human-readable guide
├── index.ts            ← barrel re-export + side-effectful define
├── {kebab}.ts          ← `class extends HTMLElement`
├── {kebab}.test.ts     ← vitest + jsdom spec
├── CHANGELOG.md
├── docs/               ← topic-by-topic deep-dives
└── examples/           ← runnable .html files
```

## Class file shape

Every helper class follows this template:

```ts
/** Public change-event detail. */
export type {Name}ChangeDetail = { /* … */ };

/** Public typing helper mirroring observed attributes / properties. */
export type {Name}Props = { /* … */ };

/** Pure helpers exported for consumer reuse. */
export function helperName(): string { /* … */ }

/** The custom-element class. Side-effect-free; index.ts defines it. */
export class {Name} extends HTMLElement {
    static get observedAttributes(): string[] {
        return ["label", "themes-url", /* … */];
    }

    // Backing storage for object / array attributes.
    #themes: string[] = [];

    // ---- Property getters / setters mirror every attribute ----

    get label(): string { return this.getAttribute("label") ?? ""; }
    set label(v: string) { this.setAttribute("label", v); }

    // ---- Lifecycle ----

    connectedCallback(): void { /* resolve initial value, render */ }
    attributeChangedCallback(name: string, _old: string | null, value: string | null): void { /* … */ }
    disconnectedCallback(): void { /* deliberate cleanup */ }
}
```

`index.ts` then performs the side-effectful registration:

```ts
import { {Name} } from "./{kebab}";
export * from "./{kebab}";
if (typeof customElements !== "undefined" && !customElements.get("{kebab}")) {
    customElements.define("{kebab}", {Name});
}
```

The guard makes re-imports idempotent and SSR-safe (the
`customElements` global only exists in browsers).

## Attribute and property conventions

- **Attributes are kebab-case.** `themes-url`, `default-value`,
  `storage-key`, `detect-from-navigator`. `static get
  observedAttributes()` lists every one that should trigger
  `attributeChangedCallback`.
- **Properties are camelCase mirrors.** `el.themesUrl`,
  `el.defaultValue`, `el.storageKey`, `el.detectFromNavigator`.
  Setters write to `setAttribute(…)` so the attribute remains the
  serialised source of truth.
- **String attributes round-trip directly.** `label`, `name`,
  `value` are stored as the attribute string.
- **Array attributes serialise as CSV.** `themes="light,dark"`. The
  matching JS property accepts a native `string[]`; the setter
  encodes back to CSV via `arr.join(",")`.
- **Object attributes serialise as JSON.** `theme-labels='{"light":
  "Bright"}'`. The matching JS property accepts a
  `Record<string, string>`; the setter encodes back via
  `JSON.stringify(obj)`. Malformed JSON parses to `{}`.
- **Boolean attributes follow the HTML convention.** Presence is
  truthy unless the attribute's literal value is `"false"`. The
  matching JS getter returns `boolean`. `apply-dir` defaults to
  `true` (absent attribute → true); `detect-from-navigator`
  defaults to `false` (absent → false). The spec for each helper
  records which.
- **Non-serialisable properties have no attribute form.** `target`
  is an `HTMLElement | null` — there is no attribute, only a JS
  property setter.

## CustomEvent contract

Each helper dispatches exactly one change event:

```ts
this.dispatchEvent(
    new CustomEvent<{Name}ChangeDetail>("themechange" | "localechange", {
        detail: { /* typed payload */ },
        bubbles: true,
        composed: true,
    }),
);
```

- `bubbles: true` lets event delegation work — a single
  `addEventListener` on `document.body` catches every picker.
- `composed: true` lets the event cross shadow-DOM boundaries — for
  consumers who wrap the picker in their own shadow root.
- `detail` is the payload; the event name lives in spec.md §4.4.

Consumers listen via `el.addEventListener("themechange", (e) => {
const { theme } = (e as CustomEvent).detail; })`.

## Light DOM

Every helper renders into its own children via `this.replaceChildren(...)`
or imperative `appendChild`. No Shadow DOM. The reasons:

- Consumer CSS targeting the kebab-case class hooks reaches the
  markup directly — no `::part()` ceremony.
- The rendered children are crawlable by search engines and
  inspectable in DevTools without "shadow root" indirection.
- Slot-style customisation is delivered through subclassing
  (override `#render()`), not Shadow DOM `<slot>` elements.

## Class hooks

The kebab-case base class lives on the rendered root child
(`<fieldset class="theme-picker">`), not on the custom-element
itself. The custom element is the container that owns the lifecycle;
the rendered `<fieldset>` is what the consumer styles.

The consumer's optional `class` attribute on the custom element is
re-applied to the rendered `<fieldset>` so `<theme-picker
class="extra-class">` produces `<fieldset class="theme-picker
extra-class">`.

## SSR

Custom elements only register in browsers with `customElements`. The
guard in `index.ts` prevents the `customElements.define(...)` call
during SSR; the class definition itself is side-effect-free. See
[`./ssr.md`](./ssr.md) for the static-site-generator recipes.

## What never lives in the helper

- Bundled CSS, fonts, icons, or images.
- A locale-aware default for `label` / any user-visible string.
- Routing, data fetching, network calls.
- Animations or transitions.
- Shadow DOM (use light DOM with class hooks).

Everything visual and locale-specific is the consumer's. See
[`shared/headless-principles.md`](./shared/headless-principles.md).

## Naming

- Class hooks are kebab-case derivatives of the tag name:
  `theme-picker`, `theme-picker-option`, `theme-picker-option-label`.
- Data attributes the consumer / CSS may want to observe use
  `data-*` (e.g. `data-theme`, `data-lily-theme-picker`).
- Don't introduce new ARIA attributes — use the platform's.

## Pure helpers exported from each module

Every helper module exports a small set of pure functions so
consumers can call them without instantiating the element:

- `normalizeThemesUrl(url: string): string`
- `themeHref(url: string, slug: string, ext: string): string`
- `bcp47LocaleTag(code: string): string`
- `isRtlLocale(code: string): boolean`
- `localeName(code: string): string`
- `matchNavigatorLanguage(navLangs, locales): string | ""`

These are exported from `{kebab}.ts` and re-exported from
`index.ts`.

## American vs British spelling

The HTML catalog uses `normalizeThemesUrl` (American `z`) to match
DOM-API convention (`document.normalize`, `Intl.NumberFormat`,
`String.normalize`). The Svelte canonical uses
`normaliseThemesUrl` (British `s`). Both libraries document the
divergence; consumers porting between frameworks rename the import.

# Custom rendering

The default rendering is an icon button that opens a
`role="listbox"` dropdown. When you need a different visual — a flag,
the active language's endonym, an SVG, a whole different control —
subclass `LocaleChooser`.

The other Lily framework helpers pass a `children` snippet / render
prop / `ChildContent` that replaces the glyph inside the button and
receives `{ value, open, labelFor }`. Custom elements in light DOM
have no such mechanism: `<slot>` is a Shadow DOM feature, and this
catalog commits to light DOM (see
[`../../AGENTS/conventions.md`](../../AGENTS/conventions.md)). The
HTML equivalent is **subclassing**, and it comes in two tiers that
differ sharply in risk.

| Tier | Hook | Keeps accessibility | Use when |
| ---- | ---- | ------------------- | -------- |
| 1 | `renderButtonContent()` | Yes, entirely | You want different button content — the common case. |
| 2 | Post-process after `super.connectedCallback()` | No — you own it | You want a fundamentally different structure. |

**Prefer Tier 1.** It is the only path that cannot break the
accessibility contract.

## Tier 1 — override `renderButtonContent()`

This is the direct `children` analogue and **the recommended path**.
It is the only customisation that cannot break accessibility.

```ts
import { LocaleChooser } from "./lily-design-system-html-locale-chooser";

class FlagLocaleChooser extends LocaleChooser {
    renderButtonContent(): Node {
        const span = document.createElement("span");
        span.textContent = this.labelFor(this.value);  // ChildArgs.labelFor + value
        span.dataset.open = String(this.open);          // ChildArgs.open
        return span;
    }
}

customElements.define("flag-locale-chooser", FlagLocaleChooser);
```

```html
<flag-locale-chooser
    label="Language"
    locales="en,fr,ar"
></flag-locale-chooser>
```

Whatever `Node` it returns is placed inside the button, replacing the
default `<span class="locale-chooser-icon">`. The three values the
other frameworks pass into `children` are all available on `this`:

| `ChildArgs` in other frameworks | Here                |
| ------------------------------- | ------------------- |
| `value`                         | `this.value`        |
| `open`                          | `this.open`         |
| `labelFor(code)`                | `this.labelFor(code)` |

The base class still builds the button and the listbox, so every
`aria-*` attribute and the whole keyboard contract keep working. Your
node is decoration inside an otherwise-intact widget.

Two rules for what you return:

- **Keep it `aria-hidden="true"` if it is decorative.** The default
  glyph is hidden so it can never become the accessible name; if you
  return visible text that duplicates `label`, hide it the same way.
  If you return the active language's endonym as *visible, meaningful*
  text, leave it exposed — but then also give it a `lang` attribute
  so it is pronounced correctly.
- **Don't add interactive content.** The button is already the
  interactive element; a nested `<button>` or `<a>` is invalid and
  breaks keyboard operation.

### Timing — when the hook re-runs

`renderButtonContent()` re-runs whenever anything it can read
changes, so content derived from `this.value` or `this.open` stays
current on its own. Concretely it is called:

- on every **structural** rebuild — a change to `locales`,
  `locale-labels`, `label`, `name`, or `class`; and
- on every **state sync** — a `value` change, and each open or close.

A bare `value` change syncs state in place rather than rebuilding the
whole tree (a rebuild would destroy focus inside an open list — see
[spec/index.md §5.7](../spec/index.md#57-reactivity)), but the button
content is refreshed as part of that sync. That is what makes the
hook behave like the reactive `children` snippet the Svelte, React,
and Vue helpers pass, so a value-dependent button needs no listener:

```ts
class LabelledLocaleChooser extends LocaleChooser {
    renderButtonContent(): Node {
        const span = document.createElement("span");
        span.className = "locale-chooser-button-label";
        span.lang = this.tagFor(this.value);
        span.textContent = this.labelFor(this.value);
        return span;
    }
}
customElements.define("labelled-locale-chooser", LabelledLocaleChooser);
```

Two consequences worth knowing:

- **Return a fresh Node each call.** The returned node replaces the
  button's previous children, so don't cache one node and hand back
  the same instance.
- **Don't hang durable state off the returned node.** Listeners
  attached inside `renderButtonContent()` are discarded with the old
  node on the next call. If you need listeners that outlive a
  refresh, attach them to the host element in `connectedCallback()`.

For purely visual open/closed styling, prefer the CSS selector
`.locale-chooser-button[aria-expanded="true"]` over re-rendering on
`this.open` — the base class keeps that attribute in sync and CSS
avoids the DOM churn.

Note the `lang` on the span: if the button shows the active locale's
endonym ("Français"), it is locale-specific content and needs the
Language-of-Parts treatment, exactly like the `<li>` options. This is
the one place the button legitimately carries a `lang` — the base
class's button never does.

The same applies to `this.open`: read it at render time for initial
state only, and drive live open/closed styling from
`.locale-chooser-button[aria-expanded="true"]` in CSS, which the base
class keeps in sync for you.

### Satisfying WCAG 2.5.3 at the source

The icon-only default fails WCAG 2.5.3 Label in Name unless the
consumer adds a visible label. Returning a fragment with both the
glyph and visible text fixes it inside the component:

```ts
class TextLocaleChooser extends LocaleChooser {
    renderButtonContent(): Node {
        const fragment = document.createDocumentFragment();

        const icon = document.createElement("span");
        icon.className = "locale-chooser-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = "\u{1F310}\uFE0E";  // globe + VS15
        fragment.appendChild(icon);

        const text = document.createElement("span");
        text.className = "locale-chooser-button-text";
        text.textContent = this.label;   // matches aria-label — 2.5.3 satisfied
        fragment.appendChild(text);

        return fragment;
    }
}
```

A `DocumentFragment` is a `Node`, so returning one to add several
children works.

### Guaranteeing the glyph's appearance

The default glyph is a plain Unicode character (U+1F310 GLOBE WITH
MERIDIANS + U+FE0E VARIATION SELECTOR-15) and this package bundles no
fonts or icon assets. VS15 asks for the monochrome text presentation,
but platforms may ignore it, and where no font covers the codepoint
you get tofu. Tier 1 is the fix:

```ts
class SvgLocaleChooser extends LocaleChooser {
    renderButtonContent(): Node {
        const ns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(ns, "svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("width", "20");
        svg.setAttribute("height", "20");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");
        const circle = document.createElementNS(ns, "circle");
        circle.setAttribute("cx", "12");
        circle.setAttribute("cy", "12");
        circle.setAttribute("r", "9");
        circle.setAttribute("fill", "none");
        circle.setAttribute("stroke", "currentColor");
        circle.setAttribute("stroke-width", "2");
        svg.appendChild(circle);
        return svg;
    }
}
customElements.define("svg-locale-chooser", SvgLocaleChooser);
```

## Tier 2 — replacing the whole rendering

`#render()` is a private field and genuinely cannot be overridden. A
subclass that wants different *structure* must post-process after the
base class has rendered:

```ts
class ButtonRowLocaleChooser extends LocaleChooser {
    connectedCallback(): void {
        super.connectedCallback();
        this.#rebuild();
    }

    attributeChangedCallback(n: string, o: string | null, v: string | null): void {
        super.attributeChangedCallback(n, o, v);
        if (n === "value" || n === "locales" || n === "locale-labels") this.#rebuild();
    }

    #rebuild(): void {
        const root = this.querySelector<HTMLElement>("div.locale-chooser");
        if (!root) return;

        // Hide the base control but keep the root (class hook) and the
        // hidden input (form participation).
        root.querySelector<HTMLElement>(".locale-chooser-button")!.hidden = true;
        root.querySelector(".locale-chooser-buttons")?.remove();

        const row = document.createElement("div");
        row.className = "locale-chooser-buttons";
        row.setAttribute("role", "group");
        row.setAttribute("aria-label", this.label);

        for (const locale of this.locales) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.setAttribute("aria-pressed", String(this.value === locale));
            btn.setAttribute("lang", this.tagFor(locale));
            btn.textContent = this.labelFor(locale);
            btn.addEventListener("click", () => { this.value = locale; });
            row.appendChild(btn);
        }
        root.appendChild(row);
    }
}
customElements.define("button-row-locale-chooser", ButtonRowLocaleChooser);
```

**A tier-2 subclass takes over the entire accessibility contract.**
Be clear-eyed about this: the base class's keyboard handling is bound
to the DOM the base class built. Replace that DOM and the keyboard
contract goes with it. In the example above the button row is
keyboard-operable because native `<button>` elements are, not because
anything was inherited.

### Invariants a tier-2 subclass must preserve

1. **Keep the `locale-chooser` class hook** on whatever root you
   render, or the consumer's CSS hook disappears.
2. **Keep the button/listbox pairing intact** if you keep a dropdown:
   `aria-haspopup="listbox"` on the trigger, `aria-expanded` kept in
   sync, `aria-controls` pointing at the list's `id`, and the list
   carrying `role="listbox"` with a matching `id`.
3. **Keep the accessible name on both the trigger and the list**
   (`aria-label` from `this.label`). An icon-only button with no name
   is unusable.
4. **Every option needs `role="option"`, a unique stable `id`, and
   `aria-selected`**; the list needs `aria-activedescendant` pointing
   at the active option while open, and nothing while closed. Use
   `this.listId` and `this.optionId(i)` so the ids stay collision-free
   across instances.
5. **Keep the glyph (or its replacement) `aria-hidden="true"`** so it
   never becomes the accessible name.
6. **Keep the hidden `<input>`** with `this.name` and the current
   value, or form participation breaks.
7. **Re-implement the full keyboard contract** ([spec/index.md
   §4.7](../spec/index.md#47-keyboard-contract)), or reuse
   `openList()` / `closeList()` and drive them yourself.
8. **Write the chosen value to `this.value`** and let the base class
   own the apply lifecycle. Never touch `lang` / `dir` on the target
   or `localStorage` directly, and never dispatch `localechange`
   yourself.

If you are replacing a dropdown with a dropdown, tier 1 plus CSS is
almost always the better answer. Tier 2 is for genuinely different
controls — a button row, a segmented control, a filter-as-you-type
combobox.

## Dropping per-option `lang`

The lightest tier-2 touch: keep everything, remove one attribute.
Appropriate when your `locale-labels` are written in the *viewer's*
language rather than each locale's own — see
[`./accessibility.md`](./accessibility.md#when-per-option-lang-does-not-help).

```ts
class ViewerLanguageLocaleChooser extends LocaleChooser {
    connectedCallback(): void {
        super.connectedCallback();
        for (const option of this.querySelectorAll(".locale-chooser-option")) {
            option.removeAttribute("lang");
        }
    }
}
customElements.define("viewer-language-locale-chooser", ViewerLanguageLocaleChooser);
```

## Styling instead of subclassing

Most visual changes need no subclass at all. The package ships no
CSS, so **the list has no positioning** — it renders in normal flow
until you give the root `position: relative` and the list
`position: absolute`. The class hooks:

| Hook                      | Element                              |
| ------------------------- | ------------------------------------ |
| `.locale-chooser`          | The rendered `<div>` root.           |
| `.locale-chooser-button`   | The trigger `<button>`.              |
| `.locale-chooser-icon`     | The default glyph `<span>`.          |
| `.locale-chooser-list`     | The `<ul role="listbox">`.           |
| `.locale-chooser-option`   | Each `<li role="option">`.           |

Plus two state selectors: `[data-active]` on the keyboard-highlighted
option and `[aria-selected="true"]` on the applied one. They are
different things and should look different.

```css
.locale-chooser { position: relative; display: inline-block; }

.locale-chooser-list {
    position: absolute;
    inset-inline-start: 0;
    inset-block-start: calc(100% + 0.25rem);
    z-index: 10;
    margin: 0;
    padding: 0.25rem 0;
    list-style: none;
    min-inline-size: 12rem;
    max-block-size: 16rem;
    overflow-y: auto;
    background: #ffffff;
    border: 1px solid #4c6272;
    border-radius: 4px;
}

/* The element toggles the `hidden` attribute; never override it away. */
.locale-chooser-list[hidden] { display: none; }

.locale-chooser-option[data-active] { background: #f0f4f5; }
.locale-chooser-option[aria-selected="true"]::after { content: " ✓"; }
```

There is no `.locale-chooser-placeholder` hook. It belonged to the
0.3.0 native-`<select>` rendering and was removed with it.

## Why subclassing, not slots

Native HTML's `<slot>` element is a Shadow DOM mechanism. The helpers
commit to light DOM so consumer `aria-*` references and CSS work
without ceremony, which means `<slot>` isn't available.

Subclassing is the platform-native customisation surface for custom
elements: the language already supports `class X extends Y`, and the
host attributes (`value`, `locales`, `locale-labels`, …) round-trip
through the superclass's setters without modification.

## Tests for subclasses

Subclass tests live in your own test file. The pattern:

```ts
class FlagLocaleChooser extends LocaleChooser {
    renderButtonContent(): Node {
        const span = document.createElement("span");
        span.setAttribute("data-testid", "custom");
        span.textContent = this.labelFor(this.value);
        return span;
    }
}
customElements.define("flag-locale-chooser", FlagLocaleChooser);

it("renders custom button content and keeps the aria wiring", () => {
    const el = document.createElement("flag-locale-chooser") as FlagLocaleChooser;
    el.setAttribute("label", "Language");
    el.setAttribute("locales", "en,fr,ar");
    document.body.appendChild(el);

    expect(el.querySelector('[data-testid="custom"]')).not.toBeNull();
    expect(el.querySelector(".locale-chooser-icon")).toBeNull();

    const btn = el.querySelector(".locale-chooser-button")!;
    expect(btn.getAttribute("aria-haspopup")).toBe("listbox");
    expect(btn.getAttribute("aria-label")).toBe("Language");
});

it("still fires localechange through the base lifecycle", () => {
    const el = document.createElement("flag-locale-chooser") as FlagLocaleChooser;
    el.setAttribute("label", "Language");
    el.setAttribute("locales", "en,fr,ar");
    document.body.appendChild(el);

    let detail;
    el.addEventListener("localechange", (e) => { detail = (e as CustomEvent).detail; });
    el.value = "ar";
    expect(detail).toEqual({ locale: "ar" });
});
```

The base class's lifecycle keeps firing because
`super.connectedCallback()` ran first.

## See also

- [`../spec/index.md` §4.8](../spec/index.md#48-custom-rendering) — the contract.
- [`./accessibility.md`](./accessibility.md) — what the base class
  guarantees and what a tier-2 subclass takes on.
- [`../examples/03-buttons.html`](../examples/03-buttons.html),
  [`../examples/05-nhs-style.html`](../examples/05-nhs-style.html),
  [`../examples/10-combobox.html`](../examples/10-combobox.html) —
  working tier-2 subclasses.

---

Lily™ and Lily Design System™ are trademarks.

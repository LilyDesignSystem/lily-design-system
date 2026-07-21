# Custom rendering

The default rendering is an icon button that opens a dropdown
listbox. When you need something else — your own SVG on the button,
the active theme's name in place of the glyph, a segmented control —
the customisation surface is **subclassing `ThemeChooser`**.

The Svelte, React, and Vue siblings pass a `children` snippet /
render prop / slot that replaces the glyph inside the button and
receives `{ value, open, labelFor }`. Custom elements in light DOM
have no equivalent: `<slot>` is a Shadow DOM mechanism, and these
helpers commit to light DOM (see
[`../../AGENTS/conventions.md`](../../AGENTS/conventions.md)). So
the HTML helper offers two tiers instead.

| Tier | Hook | Keeps accessibility | Use when |
| ---- | ---- | ------------------- | -------- |
| 1 | `renderButtonContent()` | Yes, entirely | You want different button content — the common case. |
| 2 | Post-process after `super.connectedCallback()` | No — you own it | You want a fundamentally different structure. |

**Prefer Tier 1.** It is the only path that cannot break the
accessibility contract.

## Tier 1 — override `renderButtonContent()`

This is the direct analogue of the other frameworks' `children`.
Return any `Node`; it is placed inside the button, replacing the
default `<span class="theme-chooser-icon">`.

```ts
import { ThemeChooser } from "./lily-design-system-html-theme-chooser";

class MyThemeChooser extends ThemeChooser {
    renderButtonContent(): Node {
        const span = document.createElement("span");
        span.textContent = this.labelFor(this.value);   // ChildArgs.value + labelFor
        span.dataset.open = String(this.open);           // ChildArgs.open
        return span;
    }
}

customElements.define("my-theme-chooser", MyThemeChooser);
```

```html
<my-theme-chooser
    label="Theme"
    themes-url="/assets/themes/"
    themes="light,dark,abyss"
></my-theme-chooser>
```

What you get inside the hook — the stand-ins for the `ChildArgs`
the other frameworks pass:

| Member                 | Stands in for      | Notes                                              |
| ---------------------- | ------------------ | -------------------------------------------------- |
| `this.value`           | `ChildArgs.value`  | The active slug.                                    |
| `this.open`            | `ChildArgs.open`   | Whether the listbox is open at render time.         |
| `this.labelFor(slug)`  | `ChildArgs.labelFor` | Applies `theme-labels`, else title-cases the slug. |

What the base class still owns, unchanged:

- The `<div class="theme-chooser">` root and the consumer `class`.
- The button element itself, its `type="button"`, and all of
  `aria-label`, `aria-haspopup`, `aria-expanded`, `aria-controls`.
- The `<ul role="listbox">`, every `<li role="option">`, their ids,
  `aria-selected`, `data-active`, and `aria-activedescendant`.
- The entire keyboard contract.
- The hidden `<input>`, the managed `<link>`, `data-theme`,
  `localStorage`, and the `themechange` event.

### Timing

`renderButtonContent()` re-runs whenever anything it can read
changes, so content derived from `this.value` or `this.open` stays
current without any work on your part. Concretely it is called:

- on every structural rebuild — a change to `themes`,
  `theme-labels`, `label`, `name`, or `class`; and
- on every state sync — a `value` change, and each open or close.

This is what makes the hook behave like the reactive `children`
snippet the Svelte, React, and Vue helpers pass. A value-dependent
button is therefore just the obvious code, with no listener to wire
up:

```ts
class LabelledThemeChooser extends ThemeChooser {
    renderButtonContent(): Node {
        const span = document.createElement("span");
        span.textContent = this.labelFor(this.value);
        return span;
    }
}
```

Two consequences worth knowing:

- **Return a fresh Node each call.** The returned node replaces the
  button's previous children, so don't cache one node and hand back
  the same instance.
- **Don't hang state off the returned node.** If you attach event
  listeners inside `renderButtonContent()` they are discarded with
  the old node on the next call, which is usually what you want; if
  you need durable listeners, attach them to the host element in
  `connectedCallback()` instead.

For purely visual open/closed styling, prefer the CSS selector
`.theme-chooser-button[aria-expanded="true"]` over re-rendering on
`this.open` — the base class keeps that attribute in sync and CSS
avoids the DOM churn entirely.

### Recipe: an inline SVG icon

The default glyph is a plain Unicode character with no bundled font,
so it renders differently across platforms and can even come out as
tofu. Supplying your own SVG is the fix:

```ts
class SvgThemeChooser extends ThemeChooser {
    renderButtonContent(): Node {
        const ns = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(ns, "svg");
        svg.setAttribute("class", "theme-chooser-icon");
        svg.setAttribute("aria-hidden", "true");   // keep it out of the name
        svg.setAttribute("focusable", "false");    // and out of the tab order
        svg.setAttribute("viewBox", "0 0 16 16");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");

        const circle = document.createElementNS(ns, "circle");
        circle.setAttribute("cx", "8");
        circle.setAttribute("cy", "8");
        circle.setAttribute("r", "7");
        circle.setAttribute("fill", "currentColor");
        svg.appendChild(circle);

        return svg;
    }
}
customElements.define("svg-theme-chooser", SvgThemeChooser);
```

Keep `aria-hidden="true"` on whatever you return. Without it the
graphic can leak into the accessible name and compete with
`aria-label`.

### Recipe: glyph plus visible text

The icon-only default fails WCAG 2.5.3 Label in Name unless the
consumer adds a visible label. Returning a fragment with both fixes
that at the source:

```ts
class TextThemeChooser extends ThemeChooser {
    renderButtonContent(): Node {
        const fragment = document.createDocumentFragment();

        const icon = document.createElement("span");
        icon.className = "theme-chooser-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = "◑";
        fragment.appendChild(icon);

        const text = document.createElement("span");
        text.className = "theme-chooser-button-text";
        text.textContent = this.label;   // matches aria-label — 2.5.3 satisfied
        fragment.appendChild(text);

        return fragment;
    }
}
```

A `DocumentFragment` is a `Node`, so returning one to add several
children works.

## Tier 2 — replacing the whole rendering

`#render()` is a private field and genuinely cannot be overridden —
`#`-private members in JavaScript are not visible to subclasses. A
subclass that wants a different structure must post-process after
the base class has rendered:

```ts
class SegmentedThemeChooser extends ThemeChooser {
    connectedCallback(): void {
        super.connectedCallback();
        this.#rebuild();
    }

    attributeChangedCallback(n: string, o: string | null, v: string | null): void {
        super.attributeChangedCallback(n, o, v);
        if (n === "value" || n === "themes" || n === "theme-labels") this.#rebuild();
    }

    #rebuild(): void {
        const root = this.querySelector(".theme-chooser");
        if (!root) return;
        // … build and install your own structure …
    }
}
customElements.define("segmented-theme-chooser", SegmentedThemeChooser);
```

**A subclass that does this takes over the entire accessibility
contract.** Be clear-eyed about the scale of that: the base class's
keyboard handling is bound to the DOM the base class built. Replace
that DOM and the keyboard contract goes with it — every arrow key,
`Home`/`End`, `Enter`/`Space`, `Escape`, `Tab`, and the typeahead.
None of it survives on markup the base class does not recognise.

### The invariants Tier 2 must preserve

1. **Keep the `theme-chooser` class hook** on whatever root you
   render, or the consumer's CSS hook disappears.
2. **Keep the button/listbox pairing intact**:
   `aria-haspopup="listbox"` on the trigger, `aria-expanded` kept in
   sync with the open state, `aria-controls` pointing at the list's
   `id`, and the list carrying `role="listbox"` with that matching
   `id`.
3. **Keep the accessible name on both the trigger and the list**
   (`aria-label` from `this.label`). An icon-only button with no
   name is unusable.
4. **Every option needs `role="option"`, a unique stable `id`, and
   `aria-selected`**; the list needs `aria-activedescendant`
   pointing at the active option while open, and no
   `aria-activedescendant` at all while closed. Reuse
   `this.listId` and `this.optionId(i)` for the ids.
5. **Keep the glyph (or its replacement) `aria-hidden="true"`** so
   it never becomes the accessible name.
6. **Keep the hidden `<input>`** carrying `this.name` and the
   current value, or form participation breaks — and for
   `<theme-chooser>` the managed `<link>` discriminator goes with it.
7. **Re-implement the full keyboard contract**, or reuse
   `openList()` / `closeList()` and drive them yourself from your
   own handlers.
8. **Write the chosen value to `this.value`** and let the base class
   own the apply lifecycle. Never touch `document.head`,
   `data-theme`, or `localStorage` directly, and never dispatch
   `themechange` yourself.

The full keyboard contract you are signing up to re-implement is in
[`../spec/index.md` §6.2](../spec/index.md#62-keyboard-contract).

### If you only need different styling

You almost certainly do not need Tier 2. The class hooks
(`theme-chooser`, `-button`, `-icon`, `-list`, `-option`) plus the
`[data-active]` and `[aria-selected]` state selectors cover most
visual redesigns from CSS alone, with zero accessibility risk. See
[styling.md](./styling.md).

## What a subclass should *not* do

- Don't mutate `document.head`, `data-theme`, or `localStorage`
  directly; let the base class own that lifecycle.
- Don't dispatch `themechange` yourself — the base class fires it on
  every apply, and a second event double-counts.
- Don't add a competing `name` to your controls — use `this.name`.
- Don't remove the `theme-chooser` class hook from the root.
- Don't put text into the button without either keeping it
  consistent with `aria-label` or marking it `aria-hidden`.

## Tests for subclasses

Subclass tests live in your own test file (not in
`theme-chooser.test.ts`). Assert both halves — that your content
landed, and that the base class's wiring survived:

```ts
class MyThemeChooser extends ThemeChooser { /* … */ }
customElements.define("my-theme-chooser", MyThemeChooser);

test("renderButtonContent replaces the glyph and keeps the aria wiring", async () => {
    const el = document.createElement("my-theme-chooser") as MyThemeChooser;
    el.setAttribute("label", "Theme");
    el.setAttribute("themes-url", "/t/");
    el.setAttribute("themes", "light,dark");
    document.body.appendChild(el);

    // Your content replaced the default glyph.
    expect(el.querySelector('[data-testid="custom"]')).not.toBeNull();
    expect(el.querySelector(".theme-chooser-icon")).toBeNull();

    // The base class's structure is untouched.
    const btn = el.querySelector<HTMLButtonElement>(".theme-chooser-button")!;
    expect(btn.getAttribute("aria-haspopup")).toBe("listbox");
    expect(btn.getAttribute("aria-label")).toBe("Theme");
    expect(el.querySelector(`#${btn.getAttribute("aria-controls")}`)).not.toBeNull();
});

test("subclass still fires themechange through the base lifecycle", async () => {
    const el = document.createElement("my-theme-chooser") as MyThemeChooser;
    el.setAttribute("label", "Theme");
    el.setAttribute("themes-url", "/t/");
    el.setAttribute("themes", "light,dark");
    document.body.appendChild(el);

    let detail;
    el.addEventListener("themechange", (e) => { detail = (e as CustomEvent).detail; });
    el.value = "dark";
    expect(detail).toEqual({ theme: "dark" });
});
```

The base class's lifecycle continues to fire because
`super.connectedCallback()` runs first — and, for Tier 1, because
you never intercepted the lifecycle at all.

A Tier 2 subclass needs considerably more than this: a test per
keyboard key, per aria attribute, and per open/close path. That
testing burden is itself a reason to prefer Tier 1.

---

Lily™ and Lily Design System™ are trademarks.

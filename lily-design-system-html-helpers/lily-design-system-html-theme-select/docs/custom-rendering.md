# Custom rendering

The default rendering is a native `<select>` with `<option>`
children. When you need a different visual — swatch buttons, a
segmented control, a flyout menu — subclass `ThemeSelect` and
override the rendering step.

The HTML helpers don't expose Vue scoped slots or Svelte snippets;
the customisation surface is JavaScript class extension. The base
class keeps owning the lifecycle (managed `<link>`, `data-theme`
write, `themechange` event); the subclass only changes how options
appear.

## Subclassing the class

```ts
import { ThemeSelect } from "./lily-design-system-html-theme-select";

class SwatchPicker extends ThemeSelect {
    // The class's #render() is private. Subclasses get a different
    // hook: after super.connectedCallback() runs (the default
    // <select>+options are now in place), post-process the children.
    connectedCallback(): void {
        super.connectedCallback();
        this.#renderSwatches();
    }

    attributeChangedCallback(name: string, old: string | null, value: string | null): void {
        super.attributeChangedCallback(name, old, value);
        if (name === "value" || name === "themes" || name === "theme-labels") {
            this.#renderSwatches();
        }
    }

    #renderSwatches(): void {
        const select = this.querySelector("select");
        if (!select) return;
        select.replaceWith(this.#buildSwatchContainer());
    }

    #buildSwatchContainer(): HTMLElement {
        const container = document.createElement("div");
        container.className = "theme-select";
        container.setAttribute("role", "group");
        container.setAttribute("aria-label", this.label);
        const themes = this.themes;
        const current = this.value;
        const labels = this.themeLabels;
        for (const theme of themes) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "theme-select-swatch";
            btn.dataset.theme = theme;
            btn.setAttribute("aria-pressed", String(current === theme));
            btn.textContent =
                labels[theme] ?? theme.charAt(0).toUpperCase() + theme.slice(1);
            btn.addEventListener("click", () => { this.value = theme; });
            container.appendChild(btn);
        }
        return container;
    }
}

customElements.define("swatch-picker", SwatchPicker);
```

Use it in HTML:

```html
<swatch-picker
    label="Theme"
    themes-url="/assets/themes/"
    themes="light,dark,abyss"
></swatch-picker>
```

The swatch buttons replace the `<select>`; everything else
(lifecycle, event, persistence) still works because the base class's
`attributeChangedCallback` still runs.

## Patterns

### Swatch buttons

Pattern above. Trade-offs:

- `aria-pressed` carries the active state on each button.
- The base class renders a native `<select>`; once you swap in
  buttons, the subclass owns its own a11y contract. Wrap the buttons
  in a `role="group"` container with an `aria-label` so the group is
  announced:

```ts
const select = this.querySelector("select");
if (select) {
    const group = document.createElement("div");
    group.className = "theme-select";
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", this.label);
    // … add buttons to group …
    select.replaceWith(group);
}
```

### Customizing the native `<select>`

The default rendering is already a native `<select>`. To group
options or add an extra attribute, post-process it after the base
class lays it down:

```ts
class SelectPicker extends ThemeSelect {
    connectedCallback(): void {
        super.connectedCallback();
        this.#decorateSelect();
    }
    attributeChangedCallback(name: string, old: string | null, value: string | null): void {
        super.attributeChangedCallback(name, old, value);
        if (name === "value" || name === "themes") this.#decorateSelect();
    }
    #decorateSelect(): void {
        const select = this.querySelector("select");
        if (!select) return;
        select.classList.add("my-fancy-select");
        // e.g. wrap options in <optgroup>, add a size, etc.
    }
}
customElements.define("select-picker", SelectPicker);
```

The combobox role comes free from `<select>`; the subclass only
adds visual / structural decoration.

### Custom option markup

Keep the native `<select>` but tweak its options:

```ts
class FancyOptions extends ThemeSelect {
    connectedCallback(): void {
        super.connectedCallback();
        for (const option of this.querySelectorAll("option.theme-select-option")) {
            option.classList.add("my-fancy-option");
        }
    }
}
customElements.define("fancy-options", FancyOptions);
```

This is the lightest-touch subclass: keep the `<select>`, just add
classes / data-attributes to its options.

## What the subclass should *not* do

- Don't mutate `document.head` or `data-theme` directly; let the
  base class own that lifecycle.
- Don't add a competing `name` to your controls — use
  `this.name`.
- Keep the `theme-select` CSS class hook on whatever element you
  render in place of the default `<select>`, otherwise the host's
  CSS class hook is gone.

## Why subclassing, not slots

Native HTML's `<slot>` element is a Shadow DOM mechanism. The
helpers commit to light DOM (for the reasons in
[`../AGENTS/conventions.md`](../../AGENTS/conventions.md)), so
`<slot>` isn't available without opting into Shadow DOM.

Subclassing is the platform-native customisation surface for custom
elements: the language already supports `class X extends Y`, and the
host attributes (`value`, `themes`, etc.) round-trip through the
superclass's setters without modification.

## Tests for subclasses

Subclass tests live in your own test file (not in
`theme-select.test.ts`). The pattern:

```ts
class SwatchPicker extends ThemeSelect { /* … */ }
customElements.define("swatch-picker", SwatchPicker);

it("subclass renders swatches", () => {
    const el = document.createElement("swatch-picker") as SwatchPicker;
    el.setAttribute("themes-url", "/t/");
    el.setAttribute("themes", "light,dark");
    el.setAttribute("label", "Theme");
    document.body.appendChild(el);
    expect(el.querySelectorAll("button.theme-select-swatch").length).toBe(2);
});

it("subclass still fires themechange", () => {
    const el = document.createElement("swatch-picker") as SwatchPicker;
    el.setAttribute("themes-url", "/t/");
    el.setAttribute("themes", "light,dark");
    el.setAttribute("label", "Theme");
    document.body.appendChild(el);
    let detail;
    el.addEventListener("themechange", (e) => { detail = (e as CustomEvent).detail; });
    el.value = "dark";
    expect(detail).toEqual({ theme: "dark" });
});
```

The base class's lifecycle continues to fire because
`super.connectedCallback()` runs first.

---

Lily™ and Lily Design System™ are trademarks.

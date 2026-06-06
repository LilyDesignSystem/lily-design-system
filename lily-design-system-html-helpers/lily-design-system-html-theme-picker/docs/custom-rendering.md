# Custom rendering

The default rendering is a row of native radio inputs wrapped in a
`<fieldset role="radiogroup">`. When you need a different visual —
swatch buttons, a dropdown, a segmented control, a flyout menu —
subclass `ThemePicker` and override the rendering step.

The HTML helpers don't expose Vue scoped slots or Svelte snippets;
the customisation surface is JavaScript class extension. The base
class keeps owning the lifecycle (managed `<link>`, `data-theme`
write, `themechange` event); the subclass only changes how options
appear.

## Subclassing the class

```ts
import { ThemePicker } from "./lily-design-system-html-theme-picker";

class SwatchPicker extends ThemePicker {
    // The class's #render() is private. Subclasses get a different
    // hook: after super.connectedCallback() runs (the default
    // <fieldset>+radios are now in place), post-process the children.
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
        const fieldset = this.querySelector("fieldset");
        if (!fieldset) return;
        fieldset.innerHTML = ""; // remove default radios
        const themes = this.themes;
        const current = this.value;
        const labels = this.themeLabels;
        for (const theme of themes) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "theme-picker-swatch";
            btn.dataset.theme = theme;
            btn.setAttribute("aria-pressed", String(current === theme));
            btn.textContent =
                labels[theme] ?? theme.charAt(0).toUpperCase() + theme.slice(1);
            btn.addEventListener("click", () => { this.value = theme; });
            fieldset.appendChild(btn);
        }
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

The swatch buttons replace the radios; everything else (lifecycle,
event, persistence) still works because the base class's
`attributeChangedCallback` still runs.

## Patterns

### Swatch buttons

Pattern above. Trade-offs:

- `aria-pressed` carries the active state in place of
  `aria-checked`.
- The fieldset still has `role="radiogroup"`, but the children are
  buttons — strictly speaking this is incorrect (a radiogroup
  should contain radios). Either drop the fieldset role or change
  the role to `role="group"`:

```ts
const fieldset = this.querySelector("fieldset");
if (fieldset) {
    fieldset.setAttribute("role", "group");
    fieldset.innerHTML = "";
    // … add buttons …
}
```

### Native `<select>` dropdown

```ts
class SelectPicker extends ThemePicker {
    connectedCallback(): void {
        super.connectedCallback();
        this.#renderSelect();
    }
    attributeChangedCallback(name: string, old: string | null, value: string | null): void {
        super.attributeChangedCallback(name, old, value);
        if (name === "value" || name === "themes") this.#renderSelect();
    }
    #renderSelect(): void {
        const fieldset = this.querySelector("fieldset");
        if (!fieldset) return;
        fieldset.removeAttribute("role");
        fieldset.innerHTML = "";
        const select = document.createElement("select");
        select.setAttribute("aria-label", this.label);
        for (const theme of this.themes) {
            const opt = document.createElement("option");
            opt.value = theme;
            opt.textContent = this.themeLabels[theme] ?? theme;
            if (theme === this.value) opt.selected = true;
            select.appendChild(opt);
        }
        select.addEventListener("change", () => {
            this.value = select.value;
        });
        fieldset.appendChild(select);
    }
}
customElements.define("select-picker", SelectPicker);
```

The combobox role comes free from `<select>`; the fieldset becomes
a plain wrapper.

### Custom radio markup

Keep native radios but with bespoke layout:

```ts
class FancyRadios extends ThemePicker {
    connectedCallback(): void {
        super.connectedCallback();
        for (const label of this.querySelectorAll("label.theme-picker-option")) {
            label.classList.add("my-fancy-radio");
        }
    }
}
customElements.define("fancy-radios", FancyRadios);
```

This is the lightest-touch subclass: keep the radios, just add
classes / data-attributes.

## What the subclass should *not* do

- Don't mutate `document.head` or `data-theme` directly; let the
  base class own that lifecycle.
- Don't add a competing `name` to your inputs — use
  `this.name`.
- Don't render outside the rendered `<fieldset>` (replace its
  contents; don't replace the fieldset itself, otherwise the host's
  CSS class hook (`theme-picker`) is gone).

## Why subclassing, not slots

Native HTML's `<slot>` element is a Shadow DOM mechanism. The
helpers commit to light DOM (for the reasons in
[`../AGENTS/conventions.md`](../AGENTS/conventions.md)), so
`<slot>` isn't available without opting into Shadow DOM.

Subclassing is the platform-native customisation surface for custom
elements: the language already supports `class X extends Y`, and the
host attributes (`value`, `themes`, etc.) round-trip through the
superclass's setters without modification.

## Tests for subclasses

Subclass tests live in your own test file (not in
`theme-picker.test.ts`). The pattern:

```ts
class SwatchPicker extends ThemePicker { /* … */ }
customElements.define("swatch-picker", SwatchPicker);

it("subclass renders swatches", () => {
    const el = document.createElement("swatch-picker") as SwatchPicker;
    el.setAttribute("themes-url", "/t/");
    el.setAttribute("themes", "light,dark");
    el.setAttribute("label", "Theme");
    document.body.appendChild(el);
    expect(el.querySelectorAll("button.theme-picker-swatch").length).toBe(2);
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

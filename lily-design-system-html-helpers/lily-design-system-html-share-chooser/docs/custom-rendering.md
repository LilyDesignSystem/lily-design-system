# Custom rendering — `<share-chooser>`

Light DOM has no `<slot>`, so the customisation surface is
**subclassing**. Override `renderButtonContent()` to replace the ↪
glyph; whatever it returns is placed inside the trigger.

This is the HTML-helper equivalent of the `children` snippet the Svelte,
React and Vue versions expose, and it receives the same information they
pass as `ChildArgs`.

## The contract

```ts
renderButtonContent(): Node
```

- Return any `Node` — an element, or a `DocumentFragment` for several.
- `this.open` and `this.currentUrl()` are both readable, matching
  `ChildArgs = { open, url }` in the other frameworks.
- It **re-runs on every state sync**, so a subclass reading `open` or
  the URL stays current. That is what makes it reactive rather than a
  one-shot.
- The trigger's own aria wiring — `aria-label`, `aria-expanded`,
  `aria-controls`, `type` — belongs to the base class. Do not set it
  from the subclass.

Focus lives on a list item while the list is open, never inside the
trigger, so replacing the trigger's children on sync never steals or
strands focus.

## Inline SVG instead of the glyph

The safest option if your font stack might lack U+21AA.

```js
import { ShareChooser } from "lily-design-system-html-share-chooser/share-chooser";

class SvgShareChooser extends ShareChooser {
  renderButtonContent() {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "share-chooser-icon");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", "1em");
    svg.setAttribute("height", "1em");
    svg.setAttribute("fill", "currentColor");
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", "M14 9V5l7 7-7 7v-4H3V9h11z");
    svg.appendChild(path);
    return svg;
  }
}
customElements.define("svg-share-chooser", SvgShareChooser);
```

Keep `aria-hidden="true"` and `fill="currentColor"`: the name comes from
`aria-label`, and the icon should inherit text colour.

## Glyph plus visible text

Addresses the biggest accessibility cost — an icon-only trigger — but
brings WCAG 2.5.3 into play.

```js
class LabelledShareChooser extends ShareChooser {
  renderButtonContent() {
    const frag = document.createDocumentFragment();
    const icon = document.createElement("span");
    icon.className = "share-chooser-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "↪";
    const text = document.createElement("span");
    text.className = "share-chooser-text";
    text.textContent = this.label;   // reuse the same string
    frag.append(icon, text);
    return frag;
  }
}
```

**Label in Name (WCAG 2.5.3):** once visible text exists, the
`aria-label` must *contain* it, or voice-control users saying "click
Share" will fail to match. Rendering `this.label` as the visible text,
as above, keeps them identical by construction. If you render different
text, update `label` to include it.

## Reacting to open state

```js
class ChevronShareChooser extends ShareChooser {
  renderButtonContent() {
    const span = document.createElement("span");
    span.className = "share-chooser-icon";
    span.setAttribute("aria-hidden", "true");
    span.textContent = this.open ? "×" : "↪";
    return span;
  }
}
```

Do not add `aria-expanded` yourself — the base class already sets it on
the trigger, which is where assistive technology looks.

## Showing the URL

```js
class UrlShareChooser extends ShareChooser {
  renderButtonContent() {
    const span = document.createElement("span");
    span.setAttribute("aria-hidden", "true");
    span.textContent = new URL(this.currentUrl()).hostname;
    return span;
  }
}
```

`currentUrl()` is lazy and SSR-safe: it returns the `url` attribute when
set, else `location.href`.

## Registering a subclass

```js
if (!customElements.get("svg-share-chooser")) {
  customElements.define("svg-share-chooser", SvgShareChooser);
}
```

The guard keeps hot-reload and re-imports from throwing. Import the
class from `.../share-chooser` (not the barrel) if you want the subclass
without also registering the base `<share-chooser>` tag.

## What not to override

- `#render()` / `#syncState()` — private, and the split is what keeps
  focus alive.
- The trigger's aria attributes.
- The destinations' markup. They are real links with no `role` override
  by design; see [accessibility.md](./accessibility.md).

# Custom rendering — `<lily-search-picker>`

Light DOM has no `<slot>`, so the Svelte `children` snippet becomes an
overridable method. Subclass `SearchPicker` and override
`renderButtonContent(): Node`. It can read:

- `this.open` — is the panel open?
- `this.value` — the current query text.

It re-runs on open, close, and every change to the query, so whatever it
reads stays current. Whatever it returns goes **inside** the icon
button; the button's `aria-label`, `aria-expanded` and `aria-controls`
are not the subclass's to change. Keep any icon `aria-hidden`.

```js
import { SearchPicker } from "@lilydesignsystem/web-components-search-picker";

class LabelledSearchPicker extends SearchPicker {
  renderButtonContent() {
    const frag = document.createDocumentFragment();
    frag.appendChild(super.renderButtonContent()); // the default SVG
    const text = document.createElement("span");
    text.className = "search-picker-visible-label";
    text.setAttribute("aria-hidden", "true"); // the name is still `label`
    text.textContent = this.label;
    frag.appendChild(text);
    return frag;
  }
}

customElements.define("labelled-search-picker", LabelledSearchPicker);
```

Showing the label visibly also removes the "icon-only name" cost
described in [accessibility.md](./accessibility.md).

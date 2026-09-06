// CollectionListItem component — "upgrade in place" (see breadcrumb-list-item.ts
// for the full rationale). A <ul> may only contain <li> children, so this
// component builds the real <li>, moves the host's attributes/children into
// it, then replaces itself.
//
// Attributes:
//   heading — REQUIRED. Rendered inside an <h3 class="collection-list-item-heading">.
//   href — optional; when present, wraps the heading text in an <a>.
//   meta — optional. Rendered in <p class="collection-list-item-meta">.
//   description — optional. Rendered in <p class="collection-list-item-description">.
//   image-url, image-alt — optional; when image-url is present, renders an
//     <img class="collection-list-item-image">.
//   label — optional; sets aria-label on the <li>.
//   ...rest — spread onto the <li>. Remaining light-DOM children render
//     after the description.
//
// References:
//   - components/collection-list-item/index.md (canonical contract)
//   - US Web Design System Collection: https://designsystem.digital.gov/components/collection/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["heading", "href", "meta", "description", "image-url", "image-alt", "label"]);

export class CollectionListItem extends HTMLElement {
    connectedCallback(): void {
        if (!this.isConnected) return;

        const li = document.createElement("li");
        li.className = rootClassName(this, "collection-list-item");
        const label = this.getAttribute("label");
        if (label !== null) li.setAttribute("aria-label", label);
        passThroughAttributes(this, li, HANDLED);

        const imageUrl = this.getAttribute("image-url");
        if (imageUrl !== null) {
            const img = document.createElement("img");
            img.className = "collection-list-item-image";
            img.src = imageUrl;
            img.alt = this.getAttribute("image-alt") ?? "";
            li.appendChild(img);
        }

        const heading = document.createElement("h3");
        heading.className = "collection-list-item-heading";
        const headingText = this.getAttribute("heading") ?? "";
        const href = this.getAttribute("href");
        if (href !== null) {
            const a = document.createElement("a");
            a.href = href;
            a.textContent = headingText;
            heading.appendChild(a);
        } else {
            heading.textContent = headingText;
        }
        li.appendChild(heading);

        const meta = this.getAttribute("meta");
        if (meta !== null) {
            const p = document.createElement("p");
            p.className = "collection-list-item-meta";
            p.textContent = meta;
            li.appendChild(p);
        }

        const description = this.getAttribute("description");
        if (description !== null) {
            const p = document.createElement("p");
            p.className = "collection-list-item-description";
            p.textContent = description;
            li.appendChild(p);
        }

        moveChildrenInto(this, li);
        this.replaceWith(li);
    }
}

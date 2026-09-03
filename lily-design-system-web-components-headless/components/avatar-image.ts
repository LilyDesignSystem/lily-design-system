// AvatarImage component
//
// A single <img class="avatar-image">. Composes inside Avatar /
// AvatarGroup elsewhere in the catalog, but stands alone here — it takes
// no children, since <img> is a void element.
//
// Attributes:
//   src — REQUIRED. Image URL.
//   alt — REQUIRED. Accessible alt text.
//
// References:
//   - components/avatar-image/index.md (canonical contract)

import { passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["src", "alt"]);

export class AvatarImage extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > img.avatar-image")) return;

        const img = document.createElement("img");
        img.className = rootClassName(this, "avatar-image");
        img.src = this.getAttribute("src") ?? "";
        img.alt = this.getAttribute("alt") ?? "";
        passThroughAttributes(this, img, HANDLED);

        this.appendChild(img);
    }
}

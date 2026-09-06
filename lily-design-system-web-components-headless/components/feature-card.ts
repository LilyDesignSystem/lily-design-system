// FeatureCard component
//
// A large content card with a prominent image positioned alongside or
// above the text. An <article> with the heading in a <header><h3>, an
// optional image, an optional description paragraph, and consumer
// children (e.g. CTAs) rendered last.
//
// Attributes:
//   heading — REQUIRED. Card heading, rendered in <h3 class="feature-card-heading">.
//   image-position — "start" | "end" | "top", default "start". Exposed as
//     data-image-position.
//   image-url — optional. When present, renders <img class="feature-card-image">.
//   image-alt — optional, default "". The image's alt text.
//   description — optional. Rendered in <p class="feature-card-description">.
//   label — optional. Accessible name override; defaults to heading.
//   ...rest — spread onto the <article>.
//
// References:
//   - components/feature-card/index.md (canonical contract)
//   - MDN <article>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
//   - Mozilla Protocol Design System: https://protocol.mozilla.org/

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["heading", "image-position", "image-url", "image-alt", "description", "label"]);

export class FeatureCard extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > article.feature-card")) return;

        const article = document.createElement("article");
        article.className = rootClassName(this, "feature-card");
        article.setAttribute("data-image-position", this.getAttribute("image-position") ?? "start");
        const heading = this.getAttribute("heading") ?? "";
        article.setAttribute("aria-label", this.getAttribute("label") ?? heading);
        passThroughAttributes(this, article, HANDLED);

        const imageUrl = this.getAttribute("image-url");
        if (imageUrl !== null) {
            const img = document.createElement("img");
            img.className = "feature-card-image";
            img.src = imageUrl;
            img.alt = this.getAttribute("image-alt") ?? "";
            article.appendChild(img);
        }

        const header = document.createElement("header");
        header.className = "feature-card-header";
        const h3 = document.createElement("h3");
        h3.className = "feature-card-heading";
        h3.textContent = heading;
        header.appendChild(h3);
        article.appendChild(header);

        const description = this.getAttribute("description");
        if (description !== null) {
            const p = document.createElement("p");
            p.className = "feature-card-description";
            p.textContent = description;
            article.appendChild(p);
        }

        moveChildrenInto(this, article);
        this.appendChild(article);
    }
}

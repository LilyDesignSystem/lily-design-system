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

const HANDLED = new Set([
    "heading",
    "image-position",
    "image-url",
    "image-alt",
    "description",
    "label",
]);

export class FeatureCard extends HTMLElement {
    // The image, header and description this element built, before the consumer's content.
    #parts: HTMLElement[] = [];

    // A change to heading, image-position, image-url, image-alt, description, label or class is shown (tasks.md P50-T28): the
    // built parts are built again in place, and the consumer's content is left alone.
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        const article = this.querySelector<HTMLElement>(":scope > article.feature-card");
        if (!article) return;
        this.#name(article);
        for (const part of this.#parts) part.remove();
        this.#parts = this.#build();
        article.prepend(...this.#parts);
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > article.feature-card")) return;

        const article = document.createElement("article");
        this.#name(article);
        passThroughAttributes(this, article, HANDLED);

        this.#parts = this.#build();
        article.append(...this.#parts);

        moveChildrenInto(this, article);
        this.appendChild(article);
    }

    #name(article: HTMLElement): void {
        article.className = rootClassName(this, "feature-card");
        article.setAttribute("data-image-position", this.getAttribute("image-position") ?? "start");
        article.setAttribute(
            "aria-label",
            this.getAttribute("label") ?? this.getAttribute("heading") ?? "",
        );
    }

    #build(): HTMLElement[] {
        const parts: HTMLElement[] = [];
        const heading = this.getAttribute("heading") ?? "";
        const imageUrl = this.getAttribute("image-url");
        if (imageUrl !== null) {
            const img = document.createElement("img");
            img.className = "feature-card-image";
            img.src = imageUrl;
            img.alt = this.getAttribute("image-alt") ?? "";
            parts.push(img);
        }

        const header = document.createElement("header");
        header.className = "feature-card-header";
        const h3 = document.createElement("h3");
        h3.className = "feature-card-heading";
        h3.textContent = heading;
        header.appendChild(h3);
        parts.push(header);

        const description = this.getAttribute("description");
        if (description !== null) {
            const p = document.createElement("p");
            p.className = "feature-card-description";
            p.textContent = description;
            parts.push(p);
        }
        return parts;
    }
}

// ProductCard component
//
// A specialized <article> card for displaying a product: an optional
// image, a header with the product name (<h3>) and pre-formatted price
// (<p>), followed by consumer-provided content (description, badges,
// actions).
//
// Attributes:
//   name — REQUIRED. Product name, rendered in <h3 class="product-card-name">
//     and used as the aria-label fallback.
//   price — REQUIRED. Pre-formatted price text (no currency localization).
//   image-url, image-alt — optional; renders an <img class="product-card-image">.
//   label — optional; aria-label override, defaults to name.
//
// References:
//   - components/product-card/index.md (canonical contract)

import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";

const HANDLED = new Set(["name", "price", "image-url", "image-alt", "label"]);

export class ProductCard extends HTMLElement {
    // The image and header this element built, before the consumer's content.
    #parts: HTMLElement[] = [];

    // A change to name, price, image-url, image-alt, label or class is shown (tasks.md P50-T28): the built parts are built again
    // in place, and the consumer's content is left alone.
    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    attributeChangedCallback(): void {
        const article = this.querySelector<HTMLElement>(":scope > article.product-card");
        if (!article) return;
        this.#name(article);
        for (const part of this.#parts) part.remove();
        this.#parts = this.#build();
        article.prepend(...this.#parts);
    }

    connectedCallback(): void {
        if (this.querySelector(":scope > article.product-card")) return;

        const article = document.createElement("article");
        this.#name(article);
        passThroughAttributes(this, article, HANDLED);

        this.#parts = this.#build();
        article.append(...this.#parts);

        moveChildrenInto(this, article);
        this.appendChild(article);
    }

    #name(article: HTMLElement): void {
        article.className = rootClassName(this, "product-card");
        article.setAttribute(
            "aria-label",
            this.getAttribute("label") ?? this.getAttribute("name") ?? "",
        );
    }

    #build(): HTMLElement[] {
        const parts: HTMLElement[] = [];
        const name = this.getAttribute("name") ?? "";

        const imageUrl = this.getAttribute("image-url");
        if (imageUrl !== null) {
            const img = document.createElement("img");
            img.className = "product-card-image";
            img.src = imageUrl;
            img.alt = this.getAttribute("image-alt") ?? "";
            parts.push(img);
        }

        const header = document.createElement("header");
        header.className = "product-card-header";
        const h3 = document.createElement("h3");
        h3.className = "product-card-name";
        h3.textContent = name;
        header.appendChild(h3);
        const price = document.createElement("p");
        price.className = "product-card-price";
        price.textContent = this.getAttribute("price") ?? "";
        header.appendChild(price);
        parts.push(header);
        return parts;
    }
}

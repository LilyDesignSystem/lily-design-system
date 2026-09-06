import { afterEach, describe, expect, test } from "vitest";

import { ProductCard } from "./product-card.js";

if (!customElements.get("lily-product-card")) {
    customElements.define("lily-product-card", ProductCard);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ProductCard", () => {
    test("renders a native article", () => {
        const host = render('<lily-product-card name="Wonder Widget" price="$19.99"></lily-product-card>');

        expect(host.querySelector("article.product-card")).toBeTruthy();
    });

    test("aria-label defaults to name", () => {
        const host = render('<lily-product-card name="Wonder Widget" price="$19.99"></lily-product-card>');

        expect(host.querySelector("article")!.getAttribute("aria-label")).toBe("Wonder Widget");
    });

    test("label overrides the aria-label default", () => {
        const host = render(
            '<lily-product-card name="Wonder Widget" price="$19.99" label="Featured product"></lily-product-card>',
        );

        expect(host.querySelector("article")!.getAttribute("aria-label")).toBe("Featured product");
    });

    test("renders no image when image-url is absent", () => {
        const host = render('<lily-product-card name="Wonder Widget" price="$19.99"></lily-product-card>');

        expect(host.querySelector("img")).toBeNull();
    });

    test("renders the image with image-url and image-alt when provided", () => {
        const host = render(
            '<lily-product-card name="Wonder Widget" price="$19.99" image-url="/w.png" image-alt="A widget"></lily-product-card>',
        );
        const img = host.querySelector("img.product-card-image") as HTMLImageElement;

        expect(img).toBeTruthy();
        expect(img.getAttribute("src")).toBe("/w.png");
        expect(img.getAttribute("alt")).toBe("A widget");
    });

    test("name renders inside h3.product-card-name", () => {
        const host = render('<lily-product-card name="Wonder Widget" price="$19.99"></lily-product-card>');

        expect(host.querySelector("h3.product-card-name")!.textContent).toBe("Wonder Widget");
    });

    test("price renders inside p.product-card-price", () => {
        const host = render('<lily-product-card name="Wonder Widget" price="$19.99"></lily-product-card>');

        expect(host.querySelector("p.product-card-price")!.textContent).toBe("$19.99");
    });

    test("children render after the header", () => {
        const host = render(
            '<lily-product-card name="Wonder Widget" price="$19.99"><button>Add to cart</button></lily-product-card>',
        );
        const article = host.querySelector("article")!;

        expect(article.lastElementChild!.tagName).toBe("BUTTON");
        expect(article.querySelector("header")!.nextElementSibling!.tagName).toBe("BUTTON");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render(
            '<lily-product-card name="Wonder Widget" price="$19.99" class="extra"></lily-product-card>',
        );

        expect(host.querySelector("article")!.className).toBe("product-card extra");
    });
});

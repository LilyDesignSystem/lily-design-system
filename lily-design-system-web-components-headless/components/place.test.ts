import { afterEach, describe, expect, test } from "vitest";

import { Place } from "./place.js";

if (!customElements.get("lily-place")) {
    customElements.define("lily-place", Place);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Place", () => {
    test("renders a native article", () => {
        const host = render("<lily-place>Grand Canyon</lily-place>");

        expect(host.querySelector("article.place")).toBeTruthy();
    });

    test("renders no aria-label when label is absent", () => {
        const host = render("<lily-place>Grand Canyon</lily-place>");

        expect(host.querySelector("article")!.hasAttribute("aria-label")).toBe(false);
    });

    test("uses label as an aria-label override", () => {
        const host = render('<lily-place label="Grand Canyon">Content</lily-place>');

        expect(host.querySelector("article")!.getAttribute("aria-label")).toBe("Grand Canyon");
    });

    test("moves children into the article", () => {
        const host = render("<lily-place><h2>Grand Canyon</h2></lily-place>");

        expect(host.querySelector("article > h2")!.textContent).toBe("Grand Canyon");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-place class="extra">Content</lily-place>');

        expect(host.querySelector("article")!.className).toBe("place extra");
    });

    test("passes through rest attributes", () => {
        const host = render('<lily-place data-testid="place">Content</lily-place>');

        expect(host.querySelector("article")!.getAttribute("data-testid")).toBe("place");
    });
});

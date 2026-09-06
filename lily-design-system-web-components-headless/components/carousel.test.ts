import { afterEach, describe, expect, test } from "vitest";

import { Carousel } from "./carousel.js";

if (!customElements.get("lily-carousel")) {
    customElements.define("lily-carousel", Carousel);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Carousel", () => {
    test("the custom element itself is the region (self-is-the-wrapper)", () => {
        const host = render('<lily-carousel label="Featured products"><div>Slide one</div></lily-carousel>');

        expect(host.className).toBe("carousel");
        expect(host.getAttribute("role")).toBe("region");
    });

    test("sets aria-roledescription to carousel", () => {
        const host = render('<lily-carousel label="Featured products"></lily-carousel>');

        expect(host.getAttribute("aria-roledescription")).toBe("carousel");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-carousel label="Featured products"></lily-carousel>');

        expect(host.getAttribute("aria-label")).toBe("Featured products");
    });

    test("preserves slide content", () => {
        const host = render('<lily-carousel label="Featured products"><div>Slide one</div></lily-carousel>');

        expect(host.querySelector("div")!.textContent).toBe("Slide one");
    });

    test("updates aria-label when the label attribute changes externally", () => {
        const host = render('<lily-carousel label="Featured products"></lily-carousel>');

        host.setAttribute("label", "Related products");

        expect(host.getAttribute("aria-label")).toBe("Related products");
    });
});

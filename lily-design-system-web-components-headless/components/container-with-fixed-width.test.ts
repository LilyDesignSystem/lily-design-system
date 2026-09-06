import { afterEach, describe, expect, test } from "vitest";

import { ContainerWithFixedWidth } from "./container-with-fixed-width.js";

if (!customElements.get("lily-container-with-fixed-width")) {
    customElements.define("lily-container-with-fixed-width", ContainerWithFixedWidth);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ContainerWithFixedWidth", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render("<lily-container-with-fixed-width>Content</lily-container-with-fixed-width>");

        expect(host.className).toBe("container-with-fixed-width");
    });

    test("defaults data-max-width to 1200px", () => {
        const host = render("<lily-container-with-fixed-width>Content</lily-container-with-fixed-width>");

        expect(host.getAttribute("data-max-width")).toBe("1200px");
    });

    test("reflects the max-width attribute onto data-max-width", () => {
        const host = render(
            '<lily-container-with-fixed-width max-width="960px">Content</lily-container-with-fixed-width>',
        );

        expect(host.getAttribute("data-max-width")).toBe("960px");
    });

    test("does not set an inline style (no third undocumented exception)", () => {
        const host = render("<lily-container-with-fixed-width>Content</lily-container-with-fixed-width>");

        expect(host.getAttribute("style")).toBeNull();
    });

    test("preserves children content", () => {
        const host = render("<lily-container-with-fixed-width><article>Body</article></lily-container-with-fixed-width>");

        expect(host.querySelector("article")!.textContent).toBe("Body");
    });
});

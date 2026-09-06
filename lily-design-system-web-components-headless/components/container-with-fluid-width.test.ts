import { afterEach, describe, expect, test } from "vitest";

import { ContainerWithFluidWidth } from "./container-with-fluid-width.js";

if (!customElements.get("lily-container-with-fluid-width")) {
    customElements.define("lily-container-with-fluid-width", ContainerWithFluidWidth);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ContainerWithFluidWidth", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render("<lily-container-with-fluid-width>Content</lily-container-with-fluid-width>");

        expect(host.className).toBe("container-with-fluid-width");
    });

    test("defaults data-padding-inline to 1rem", () => {
        const host = render("<lily-container-with-fluid-width>Content</lily-container-with-fluid-width>");

        expect(host.getAttribute("data-padding-inline")).toBe("1rem");
    });

    test("reflects the padding-inline attribute onto data-padding-inline", () => {
        const host = render(
            '<lily-container-with-fluid-width padding-inline="2rem">Content</lily-container-with-fluid-width>',
        );

        expect(host.getAttribute("data-padding-inline")).toBe("2rem");
    });

    test("does not set an inline style (no third undocumented exception)", () => {
        const host = render("<lily-container-with-fluid-width>Content</lily-container-with-fluid-width>");

        expect(host.getAttribute("style")).toBeNull();
    });

    test("preserves children content", () => {
        const host = render("<lily-container-with-fluid-width><section>Body</section></lily-container-with-fluid-width>");

        expect(host.querySelector("section")!.textContent).toBe("Body");
    });
});

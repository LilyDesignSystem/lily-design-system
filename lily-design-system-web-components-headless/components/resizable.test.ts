import { afterEach, describe, expect, test } from "vitest";

import { Resizable } from "./resizable.js";

if (!customElements.get("lily-resizable")) {
    customElements.define("lily-resizable", Resizable);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Resizable", () => {
    test("carries the base class", () => {
        const host = render('<lily-resizable label="Sidebar"><nav></nav></lily-resizable>');

        expect(host.classList.contains("resizable")).toBe(true);
    });

    test("has role=region", () => {
        const host = render('<lily-resizable label="Sidebar"><nav></nav></lily-resizable>');

        expect(host.getAttribute("role")).toBe("region");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-resizable label="Sidebar"><nav></nav></lily-resizable>');

        expect(host.getAttribute("aria-label")).toBe("Sidebar");
    });

    test("is keyboard-focusable via tabindex=0", () => {
        const host = render('<lily-resizable label="Sidebar"><nav></nav></lily-resizable>');

        expect(host.tabIndex).toBe(0);
    });

    test("defaults data-resize to both", () => {
        const host = render('<lily-resizable label="Sidebar"><nav></nav></lily-resizable>');

        expect(host.getAttribute("data-resize")).toBe("both");
    });

    test("honours an explicit direction", () => {
        const host = render('<lily-resizable label="Sidebar" direction="horizontal"><nav></nav></lily-resizable>');

        expect(host.getAttribute("data-resize")).toBe("horizontal");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render('<lily-resizable label="Sidebar" class="my-resizable"><nav></nav></lily-resizable>');

        expect(host.getAttribute("class")).toBe("resizable my-resizable");
    });
});

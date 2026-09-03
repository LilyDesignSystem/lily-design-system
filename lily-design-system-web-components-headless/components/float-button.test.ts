import { afterEach, describe, expect, test } from "vitest";

import { FloatButton } from "./float-button.js";

if (!customElements.get("lily-float-button")) {
    customElements.define("lily-float-button", FloatButton);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("FloatButton", () => {
    test("defaults to bottom-right", () => {
        const host = render('<lily-float-button label="Add"></lily-float-button>');

        expect(host.querySelector("button")!.getAttribute("data-position")).toBe("bottom-right");
    });

    test("honours an explicit position", () => {
        const host = render('<lily-float-button label="Add" position="top-left"></lily-float-button>');

        const button = host.querySelector("button") as HTMLButtonElement;
        expect(button.getAttribute("data-position")).toBe("top-left");
        expect(button.getAttribute("style")).toContain("top:");
        expect(button.getAttribute("style")).toContain("left:");
    });

    test("throws when label is missing (WCAG 4.1.2)", () => {
        const host = document.createElement("lily-float-button");

        expect(() => (host as unknown as FloatButton).connectedCallback()).toThrow(/label attribute/);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-float-button label="Add item"></lily-float-button>');

        expect(host.querySelector("button")!.getAttribute("aria-label")).toBe("Add item");
    });

    test("sets inline position:fixed for structural placement", () => {
        const host = render('<lily-float-button label="Add"></lily-float-button>');

        expect(host.querySelector("button")!.getAttribute("style")).toContain("position: fixed");
    });
});

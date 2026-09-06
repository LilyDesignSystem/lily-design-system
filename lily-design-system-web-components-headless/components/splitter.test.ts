import { afterEach, describe, expect, test } from "vitest";

import { Splitter } from "./splitter.js";

if (!customElements.get("lily-splitter")) {
    customElements.define("lily-splitter", Splitter);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Splitter", () => {
    test("carries the base class and role=separator", () => {
        const host = render('<lily-splitter label="Resize panels"></lily-splitter>');

        expect(host.classList.contains("splitter")).toBe(true);
        expect(host.getAttribute("role")).toBe("separator");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-splitter label="Resize panels"></lily-splitter>');

        expect(host.getAttribute("aria-label")).toBe("Resize panels");
    });

    test("defaults orientation to vertical", () => {
        const host = render('<lily-splitter label="Resize panels"></lily-splitter>');

        expect(host.getAttribute("aria-orientation")).toBe("vertical");
    });

    test("honours an explicit orientation", () => {
        const host = render('<lily-splitter label="Resize panels" orientation="horizontal"></lily-splitter>');

        expect(host.getAttribute("aria-orientation")).toBe("horizontal");
    });

    test("is keyboard-focusable and reports default range values", () => {
        const host = render('<lily-splitter label="Resize panels"></lily-splitter>');

        expect(host.tabIndex).toBe(0);
        expect(host.getAttribute("aria-valuenow")).toBe("50");
        expect(host.getAttribute("aria-valuemin")).toBe("0");
        expect(host.getAttribute("aria-valuemax")).toBe("100");
    });

    test("merges the consumer's class attribute with the base class", () => {
        const host = render('<lily-splitter label="Resize panels" class="my-splitter"></lily-splitter>');

        expect(host.classList.contains("splitter")).toBe(true);
        expect(host.classList.contains("my-splitter")).toBe(true);
    });
});

import { afterEach, describe, expect, test } from "vitest";

import { FlexStack } from "./flex-stack.js";

if (!customElements.get("lily-flex-stack")) {
    customElements.define("lily-flex-stack", FlexStack);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("FlexStack", () => {
    test("renders as itself with the base class", () => {
        const host = render("<lily-flex-stack><span>One</span></lily-flex-stack>");

        expect(host.tagName.toLowerCase()).toBe("lily-flex-stack");
        expect(host.className).toBe("flex-stack");
    });

    test("defaults data-direction to column and data-gap to 1rem", () => {
        const host = render("<lily-flex-stack></lily-flex-stack>");

        expect(host.getAttribute("data-direction")).toBe("column");
        expect(host.getAttribute("data-gap")).toBe("1rem");
    });

    test("reflects a row direction and custom gap via data attributes", () => {
        const host = render('<lily-flex-stack direction="row" gap="0.5rem"></lily-flex-stack>');

        expect(host.getAttribute("data-direction")).toBe("row");
        expect(host.getAttribute("data-gap")).toBe("0.5rem");
    });

    test("exposes align and justify via data attributes only when provided", () => {
        const host = render('<lily-flex-stack align="center" justify="space-between"></lily-flex-stack>');

        expect(host.getAttribute("data-align")).toBe("center");
        expect(host.getAttribute("data-justify")).toBe("space-between");
    });

    test("omits data-align and data-justify when not provided", () => {
        const host = render("<lily-flex-stack></lily-flex-stack>");

        expect(host.hasAttribute("data-align")).toBe(false);
        expect(host.hasAttribute("data-justify")).toBe(false);
    });

    test("preserves children in place", () => {
        const host = render("<lily-flex-stack><span>One</span><span>Two</span></lily-flex-stack>");

        expect(host.children.length).toBe(2);
        expect(host.textContent).toBe("OneTwo");
    });

    test("appends the consumer's class hook to the base class", () => {
        const host = render('<lily-flex-stack class="toolbar"></lily-flex-stack>');

        expect(host.className).toBe("flex-stack toolbar");
    });

    test("does not apply an inline style (deviation from other frameworks)", () => {
        const host = render('<lily-flex-stack direction="row"></lily-flex-stack>');

        expect(host.getAttribute("style")).toBeNull();
    });
});

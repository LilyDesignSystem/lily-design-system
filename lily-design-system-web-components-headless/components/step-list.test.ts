import { afterEach, describe, expect, test } from "vitest";

import { StepList } from "./step-list.js";

if (!customElements.get("lily-step-list")) {
    customElements.define("lily-step-list", StepList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("StepList", () => {
    test("renders a native ordered list", () => {
        const host = render("<lily-step-list></lily-step-list>");

        expect(host.querySelector("ol.step-list")).toBeTruthy();
    });

    test("aria-label is omitted when label is absent", () => {
        const host = render("<lily-step-list></lily-step-list>");

        expect(host.querySelector("ol")!.hasAttribute("aria-label")).toBe(false);
    });

    test("aria-label reflects a provided label", () => {
        const host = render('<lily-step-list label="Checkout"></lily-step-list>');

        expect(host.querySelector("ol")!.getAttribute("aria-label")).toBe("Checkout");
    });

    test("data-current is omitted when current is absent", () => {
        const host = render("<lily-step-list></lily-step-list>");

        expect(host.querySelector("ol")!.hasAttribute("data-current")).toBe(false);
    });

    test("data-current reflects a provided current index", () => {
        const host = render('<lily-step-list current="1"></lily-step-list>');

        expect(host.querySelector("ol")!.getAttribute("data-current")).toBe("1");
    });

    test("moves its children into the ol", () => {
        const host = render("<lily-step-list><li>Cart</li></lily-step-list>");

        expect(host.querySelector("ol > li")!.textContent).toBe("Cart");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-step-list class="extra"></lily-step-list>');

        expect(host.querySelector("ol")!.className).toBe("step-list extra");
    });

    test("passes through rest attributes to the ol", () => {
        const host = render('<lily-step-list data-testid="steps"></lily-step-list>');

        expect(host.querySelector("ol")!.getAttribute("data-testid")).toBe("steps");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-step-list></lily-step-list>");

        (host as unknown as StepList).connectedCallback();

        expect(host.querySelectorAll("ol").length).toBe(1);
    });
});

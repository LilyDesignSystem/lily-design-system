import { afterEach, describe, expect, test } from "vitest";

import { CheckList } from "./check-list.js";

if (!customElements.get("lily-check-list")) {
    customElements.define("lily-check-list", CheckList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("CheckList", () => {
    test("renders a native ordered list", () => {
        const host = render("<lily-check-list></lily-check-list>");

        expect(host.querySelector("ol.check-list")).toBeTruthy();
    });

    test("has role=list", () => {
        const host = render("<lily-check-list></lily-check-list>");

        expect(host.querySelector("ol")!.getAttribute("role")).toBe("list");
    });

    test("aria-label is omitted when label is absent", () => {
        const host = render("<lily-check-list></lily-check-list>");

        expect(host.querySelector("ol")!.hasAttribute("aria-label")).toBe(false);
    });

    test("aria-label reflects a provided label", () => {
        const host = render('<lily-check-list label="Onboarding tasks"></lily-check-list>');

        expect(host.querySelector("ol")!.getAttribute("aria-label")).toBe("Onboarding tasks");
    });

    test("moves its children into the ol", () => {
        const host = render("<lily-check-list><li>Create account</li></lily-check-list>");

        expect(host.querySelector("ol > li")!.textContent).toBe("Create account");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-check-list class="extra"></lily-check-list>');

        expect(host.querySelector("ol")!.className).toBe("check-list extra");
    });

    test("passes through rest attributes to the ol", () => {
        const host = render('<lily-check-list data-testid="checklist"></lily-check-list>');

        expect(host.querySelector("ol")!.getAttribute("data-testid")).toBe("checklist");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-check-list></lily-check-list>");

        (host as unknown as CheckList).connectedCallback();

        expect(host.querySelectorAll("ol").length).toBe(1);
    });
});

import { afterEach, describe, expect, test, vi } from "vitest";

import { TourList } from "./tour-list.js";

if (!customElements.get("lily-tour-list")) {
    customElements.define("lily-tour-list", TourList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("TourList", () => {
    test("renders a native ordered list with role=dialog, hidden by default", () => {
        const host = render('<lily-tour-list label="Getting started"></lily-tour-list>');

        const ol = host.querySelector("ol.tour-list") as HTMLOListElement;
        expect(ol).toBeTruthy();
        expect(ol.getAttribute("role")).toBe("dialog");
        expect(ol.hidden).toBe(true);
    });

    test("aria-modal is true and tabindex is -1", () => {
        const host = render('<lily-tour-list label="Getting started"></lily-tour-list>');

        const ol = host.querySelector("ol")!;
        expect(ol.getAttribute("aria-modal")).toBe("true");
        expect(ol.tabIndex).toBe(-1);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-tour-list label="Getting started"></lily-tour-list>');

        expect(host.querySelector("ol")!.getAttribute("aria-label")).toBe("Getting started");
    });

    test("active attribute shows the tour", () => {
        const host = render('<lily-tour-list label="Getting started" active></lily-tour-list>');

        expect(host.querySelector("ol")!.hidden).toBe(false);
    });

    test("toggling active externally updates the rendered ol", () => {
        const host = render('<lily-tour-list label="Getting started"></lily-tour-list>');

        host.toggleAttribute("active", true);

        expect(host.querySelector("ol")!.hidden).toBe(false);
    });

    test("Escape closes the tour and dispatches lily-close", () => {
        const host = render('<lily-tour-list label="Getting started" active></lily-tour-list>');
        const ol = host.querySelector("ol") as HTMLOListElement;
        const handler = vi.fn();
        host.addEventListener("lily-close", handler);

        ol.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

        expect(host.hasAttribute("active")).toBe(false);
        expect(ol.hidden).toBe(true);
        expect(handler).toHaveBeenCalled();
    });

    test("moves its children into the ol", () => {
        const host = render('<lily-tour-list label="Getting started" active><li>Welcome</li></lily-tour-list>');

        expect(host.querySelector("ol > li")!.textContent).toBe("Welcome");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-tour-list label="Getting started" class="extra"></lily-tour-list>');

        expect(host.querySelector("ol")!.className).toBe("tour-list extra");
    });
});

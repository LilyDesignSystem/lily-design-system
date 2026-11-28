import { afterEach, describe, expect, test, vi } from "vitest";

import { ActionBar } from "./action-bar.js";

if (!customElements.get("lily-action-bar")) {
    customElements.define("lily-action-bar", ActionBar);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ActionBar", () => {
    test("renders with role=toolbar and the base class", () => {
        const host = render(
            '<lily-action-bar label="Bulk actions" selected-count="3" selected-count-label="3 selected"></lily-action-bar>',
        );

        expect(host.getAttribute("role")).toBe("toolbar");
        expect(host.className).toBe("action-bar");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-action-bar label="Bulk actions" selected-count="3" selected-count-label="3 selected"></lily-action-bar>',
        );

        expect(host.getAttribute("aria-label")).toBe("Bulk actions");
    });

    test("exposes selected-count via data-selected-count", () => {
        const host = render(
            '<lily-action-bar label="Bulk actions" selected-count="3" selected-count-label="3 selected"></lily-action-bar>',
        );

        expect(host.getAttribute("data-selected-count")).toBe("3");
    });

    test("renders selectedCountLabel text visibly", () => {
        const host = render(
            '<lily-action-bar label="Bulk actions" selected-count="3" selected-count-label="3 selected"></lily-action-bar>',
        );

        expect(host.querySelector(".action-bar-count")!.textContent).toBe("3 selected");
    });

    test("does not render a clear button when clear-selection-label is absent", () => {
        const host = render(
            '<lily-action-bar label="Bulk actions" selected-count="3" selected-count-label="3 selected"></lily-action-bar>',
        );

        expect(host.querySelector(".action-bar-clear")).toBeNull();
    });

    test("renders a clear button when clear-selection-label is present", () => {
        const host = render(
            '<lily-action-bar label="Bulk actions" selected-count="3" selected-count-label="3 selected" clear-selection-label="Clear selection"></lily-action-bar>',
        );

        const clear = host.querySelector(".action-bar-clear") as HTMLButtonElement;
        expect(clear).toBeTruthy();
        expect(clear.getAttribute("aria-label")).toBe("Clear selection");
    });

    test("clicking clear fires lily-clear-selection", () => {
        const host = render(
            '<lily-action-bar label="Bulk actions" selected-count="3" selected-count-label="3 selected" clear-selection-label="Clear selection"></lily-action-bar>',
        );
        const handler = vi.fn();
        host.addEventListener("lily-clear-selection", handler);

        (host.querySelector(".action-bar-clear") as HTMLButtonElement).click();

        expect(handler).toHaveBeenCalledOnce();
    });

    test("children (action buttons) render inside the toolbar", () => {
        const host = render(
            '<lily-action-bar label="Bulk actions" selected-count="3" selected-count-label="3 selected"><button id="del"></button></lily-action-bar>',
        );

        expect(host.querySelector("#del")).toBeTruthy();
    });
});

describe("ActionBar follows its attributes (P50-T28)", () => {
    test("shows a change to its labels, count and class; the clear button comes and goes", () => {
        const host = render(
            '<lily-action-bar label="Old" selected-count="1" selected-count-label="1 selected"><button>Delete</button></lily-action-bar>',
        );
        host.setAttribute("label", "New");
        host.setAttribute("selected-count", "3");
        host.setAttribute("selected-count-label", "3 selected");
        host.setAttribute("clear-selection-label", "Clear");
        host.setAttribute("class", "wide");
        expect(host.className).toBe("action-bar wide");
        expect(host.getAttribute("aria-label")).toBe("New");
        expect(host.getAttribute("data-selected-count")).toBe("3");
        expect(host.querySelector(".action-bar-count")?.textContent).toBe("3 selected");
        const clear = host.querySelector(".action-bar-clear") as HTMLButtonElement;
        expect(clear.getAttribute("aria-label")).toBe("Clear");
        host.setAttribute("clear-selection-label", "Deselect");
        expect(host.querySelectorAll(".action-bar-clear")).toHaveLength(1);
        expect(clear.getAttribute("aria-label")).toBe("Deselect");
        host.removeAttribute("clear-selection-label");
        expect(host.querySelector(".action-bar-clear")).toBeNull();
        expect(host.querySelectorAll(".action-bar-count")).toHaveLength(1);
    });
});

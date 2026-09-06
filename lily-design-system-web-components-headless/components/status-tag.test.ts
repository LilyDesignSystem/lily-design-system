import { afterEach, describe, expect, test } from "vitest";

import { StatusTag } from "./status-tag.js";

if (!customElements.get("lily-status-tag")) {
    customElements.define("lily-status-tag", StatusTag);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("StatusTag", () => {
    test("renders a native span with the visible text content", () => {
        const host = render("<lily-status-tag>Completed</lily-status-tag>");

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span.classList.contains("status-tag")).toBe(true);
        expect(span.textContent).toBe("Completed");
    });

    test("defaults data-tone to neutral", () => {
        const host = render("<lily-status-tag>Completed</lily-status-tag>");

        expect(host.querySelector("span")!.getAttribute("data-tone")).toBe("neutral");
    });

    test("honours an explicit tone", () => {
        const host = render('<lily-status-tag tone="success">Completed</lily-status-tag>');

        expect(host.querySelector("span")!.getAttribute("data-tone")).toBe("success");
    });

    test("an explicit label becomes aria-label", () => {
        const host = render('<lily-status-tag label="Task status: completed">Completed</lily-status-tag>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Task status: completed");
    });

    test("omits aria-label when no label is given", () => {
        const host = render("<lily-status-tag>Completed</lily-status-tag>");

        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("does not set role=status (majority-implementation contract)", () => {
        const host = render("<lily-status-tag>Completed</lily-status-tag>");

        expect(host.querySelector("span")!.hasAttribute("role")).toBe(false);
    });
});

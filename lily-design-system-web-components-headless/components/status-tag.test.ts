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

    test("defaults data-type to default, as Svelte does", () => {
        const host = render("<lily-status-tag>Completed</lily-status-tag>");

        expect(host.querySelector("span")!.getAttribute("data-type")).toBe("default");
    });

    test("renders an explicit type as data-type", () => {
        const host = render('<lily-status-tag type="success">Completed</lily-status-tag>');

        expect(host.querySelector("span")!.getAttribute("data-type")).toBe("success");
        expect(host.querySelector("span")!.hasAttribute("type")).toBe(false);
    });

    test("still reads the older tone attribute, mapping danger to error and neutral to default", () => {
        const pick = (html: string) =>
            render(html).querySelector("span")!.getAttribute("data-type");

        expect(pick('<lily-status-tag tone="danger">Failed</lily-status-tag>')).toBe("error");
        expect(pick('<lily-status-tag tone="neutral">Draft</lily-status-tag>')).toBe("default");
        expect(pick('<lily-status-tag tone="warning">Pending</lily-status-tag>')).toBe("warning");
        expect(pick('<lily-status-tag type="info" tone="danger">New</lily-status-tag>')).toBe(
            "info",
        );
    });

    test("an explicit label becomes hidden text", () => {
        const host = render(
            '<lily-status-tag label="Task status: completed">Completed</lily-status-tag>',
        );

        const root = host.querySelector("span")!;
        expect(root.hasAttribute("aria-label")).toBe(false);
        expect(root.querySelector(".screen-reader-span")!.textContent).toBe(
            "Task status: completed ",
        );
    });

    test("adds no hidden text when no label is given", () => {
        const host = render("<lily-status-tag>Completed</lily-status-tag>");

        expect(host.querySelector(".screen-reader-span")).toBeNull();
    });

    test("does not set role=status (majority-implementation contract)", () => {
        const host = render("<lily-status-tag>Completed</lily-status-tag>");

        expect(host.querySelector("span")!.hasAttribute("role")).toBe(false);
    });
});

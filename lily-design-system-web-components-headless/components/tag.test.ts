import { afterEach, describe, expect, test } from "vitest";

import { Tag } from "./tag.js";

if (!customElements.get("lily-tag")) {
    customElements.define("lily-tag", Tag);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Tag", () => {
    test("renders a native span with role=status", () => {
        const host = render('<lily-tag label="Status: Completed">Completed</lily-tag>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span.classList.contains("tag")).toBe(true);
        expect(span.getAttribute("role")).toBe("status");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-tag label="Status: Overdue">Overdue</lily-tag>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Status: Overdue");
    });

    test("moves children into the span", () => {
        const host = render('<lily-tag label="Status: Active">Active</lily-tag>');

        expect(host.querySelector("span")!.textContent).toBe("Active");
        expect(host.children.length).toBe(1);
    });

    test("passes through rest attributes onto the span", () => {
        const host = render('<lily-tag label="Status: Active" data-testid="tag-1">Active</lily-tag>');

        expect(host.querySelector("span")!.getAttribute("data-testid")).toBe("tag-1");
    });

    test("merges the consumer's class attribute with the base class", () => {
        const host = render('<lily-tag label="Status: Active" class="my-tag">Active</lily-tag>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span.classList.contains("tag")).toBe(true);
        expect(span.classList.contains("my-tag")).toBe(true);
    });
});

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
    test("renders a native span that is not a live region by default", () => {
        const host = render('<lily-tag label="Status: Completed">Completed</lily-tag>');

        const span = host.querySelector("span.tag") as HTMLSpanElement;
        expect(span).toBeTruthy();
        expect(span.hasAttribute("role")).toBe(false);
        expect(span.hasAttribute("aria-label")).toBe(false);
        expect(host.children.length).toBe(1);
    });

    test("by default the label is screen-reader text appended to the exposed content", () => {
        const host = render('<lily-tag label="Status: Overdue">Overdue</lily-tag>');
        const span = host.querySelector("span.tag")!;

        expect(span.querySelector(".screen-reader-span")!.textContent).toBe("Status: Overdue");
        expect(span.querySelector("[aria-hidden]")).toBeNull();
        expect(span.firstChild!.textContent).toBe("Overdue");
    });

    test("live renders a status region named by aria-label, with the children moved in", () => {
        const host = render('<lily-tag label="Build: Passing" live>Passing</lily-tag>');
        const span = host.querySelector("span.tag")!;

        expect(span.getAttribute("role")).toBe("status");
        expect(span.getAttribute("aria-label")).toBe("Build: Passing");
        expect(span.textContent).toBe("Passing");
        expect(span.hasAttribute("live")).toBe(false);
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

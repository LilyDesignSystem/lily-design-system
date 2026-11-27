import { afterEach, describe, expect, test } from "vitest";

import { Flair } from "./flair.js";

if (!customElements.get("lily-flair")) {
    customElements.define("lily-flair", Flair);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Flair", () => {
    test("renders a span with the correct class", () => {
        const host = render("<lily-flair>New</lily-flair>");

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("flair");
    });

    test("is aria-hidden and decorative when no label is given", () => {
        const host = render("<lily-flair>New</lily-flair>");

        const span = host.querySelector("span")!;
        expect(span.getAttribute("aria-hidden")).toBe("true");
        expect(span.hasAttribute("aria-label")).toBe(false);
    });

    test("becomes meaningful with aria-label when label is given", () => {
        const host = render('<lily-flair label="Role: Moderator">Moderator</lily-flair>');

        const span = host.querySelector("span")!;
        expect(span.getAttribute("aria-label")).toBe("Role: Moderator");
        expect(span.hasAttribute("aria-hidden")).toBe(false);
    });

    test("moves children into the inner span", () => {
        const host = render("<lily-flair>Featured</lily-flair>");

        expect(host.querySelector("span")!.textContent).toBe("Featured");
    });

    test("passes through rest attributes and the class hook", () => {
        const host = render('<lily-flair class="extra" data-testid="flair">New</lily-flair>');

        const span = host.querySelector("span")!;
        expect(span.className).toBe("flair extra");
        expect(span.getAttribute("data-testid")).toBe("flair");
    });

    test("shows a change to its attributes after it is mounted (P50-T28)", () => {
        document.body.innerHTML = `<lily-flair >*</lily-flair>`;
        const el = document.querySelector("lily-flair")!;
        el.setAttribute("label", "New");
        const span = el.querySelector("span.flair")!;
        expect(span.getAttribute("role")).toBe("img");
        expect(span.getAttribute("aria-label")).toBe("New");
        expect(span.hasAttribute("aria-hidden")).toBe(false);
        el.removeAttribute("label");
        expect(span.getAttribute("aria-hidden")).toBe("true");
        expect(span.hasAttribute("role")).toBe(false);
    });
});

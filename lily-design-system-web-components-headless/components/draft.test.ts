import { afterEach, describe, expect, test } from "vitest";

import { Draft } from "./draft.js";

if (!customElements.get("lily-draft")) {
    customElements.define("lily-draft", Draft);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Draft", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render("<lily-draft>Draft body text.</lily-draft>");

        expect(host.className).toBe("draft");
    });

    test("has no aria-label or data-status by default", () => {
        const host = render("<lily-draft>Draft body text.</lily-draft>");

        expect(host.hasAttribute("aria-label")).toBe(false);
        expect(host.hasAttribute("data-status")).toBe(false);
    });

    test("applies aria-label when provided", () => {
        const host = render('<lily-draft label="Draft article">Draft body text.</lily-draft>');

        expect(host.getAttribute("aria-label")).toBe("Draft article");
    });

    test("reflects status onto data-status", () => {
        const host = render('<lily-draft status="in-progress">Draft body text.</lily-draft>');

        expect(host.getAttribute("data-status")).toBe("in-progress");
    });

    test("preserves children content", () => {
        const host = render("<lily-draft><p>Draft body text.</p></lily-draft>");

        expect(host.querySelector("p")!.textContent).toBe("Draft body text.");
    });
});

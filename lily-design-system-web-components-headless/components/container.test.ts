import { afterEach, describe, expect, test } from "vitest";

import { Container } from "./container.js";

if (!customElements.get("lily-container")) {
    customElements.define("lily-container", Container);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Container", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render("<lily-container><p>Content</p></lily-container>");

        expect(host.className).toBe("container");
    });

    test("has no ARIA role", () => {
        const host = render("<lily-container><p>Content</p></lily-container>");

        expect(host.hasAttribute("role")).toBe(false);
    });

    test("preserves children content", () => {
        const host = render("<lily-container><p>Content</p></lily-container>");

        expect(host.querySelector("p")!.textContent).toBe("Content");
    });

    test("merges the consumer's class attribute", () => {
        const host = render('<lily-container class="wide"></lily-container>');

        expect(host.classList.contains("container")).toBe(true);
        expect(host.classList.contains("wide")).toBe(true);
    });

    test("rest attributes pass through onto the host", () => {
        const host = render('<lily-container data-testid="main"></lily-container>');

        expect(host.getAttribute("data-testid")).toBe("main");
    });
});

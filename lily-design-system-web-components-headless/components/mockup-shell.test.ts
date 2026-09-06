import { afterEach, describe, expect, test } from "vitest";

import { MockupShell } from "./mockup-shell.js";

if (!customElements.get("lily-mockup-shell")) {
    customElements.define("lily-mockup-shell", MockupShell);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MockupShell", () => {
    test("the custom element itself is the frame (self-is-the-wrapper)", () => {
        const host = render("<lily-mockup-shell><p>Content</p></lily-mockup-shell>");

        expect(host.className).toBe("mockup-shell");
    });

    test("label is optional and maps to aria-label when provided", () => {
        const host = render('<lily-mockup-shell label="Preview of the terminal session"></lily-mockup-shell>');

        expect(host.getAttribute("aria-label")).toBe("Preview of the terminal session");
    });

    test("omits aria-label when label is not provided", () => {
        const host = render("<lily-mockup-shell></lily-mockup-shell>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("keeps children in place", () => {
        const host = render("<lily-mockup-shell><p>Content</p></lily-mockup-shell>");

        expect(host.querySelector("p")!.textContent).toBe("Content");
    });

    test("applies the consumer's class hook alongside the base class", () => {
        const host = render('<lily-mockup-shell class="extra"></lily-mockup-shell>');

        expect(host.className).toBe("mockup-shell extra");
    });
});

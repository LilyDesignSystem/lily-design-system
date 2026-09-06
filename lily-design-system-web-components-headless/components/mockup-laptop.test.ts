import { afterEach, describe, expect, test } from "vitest";

import { MockupLaptop } from "./mockup-laptop.js";

if (!customElements.get("lily-mockup-laptop")) {
    customElements.define("lily-mockup-laptop", MockupLaptop);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MockupLaptop", () => {
    test("the custom element itself is the frame (self-is-the-wrapper)", () => {
        const host = render("<lily-mockup-laptop><p>Content</p></lily-mockup-laptop>");

        expect(host.className).toBe("mockup-laptop");
    });

    test("label is optional and maps to aria-label when provided", () => {
        const host = render('<lily-mockup-laptop label="Preview of the dashboard"></lily-mockup-laptop>');

        expect(host.getAttribute("aria-label")).toBe("Preview of the dashboard");
    });

    test("omits aria-label when label is not provided", () => {
        const host = render("<lily-mockup-laptop></lily-mockup-laptop>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("keeps children in place", () => {
        const host = render("<lily-mockup-laptop><p>Content</p></lily-mockup-laptop>");

        expect(host.querySelector("p")!.textContent).toBe("Content");
    });

    test("applies the consumer's class hook alongside the base class", () => {
        const host = render('<lily-mockup-laptop class="extra"></lily-mockup-laptop>');

        expect(host.className).toBe("mockup-laptop extra");
    });
});

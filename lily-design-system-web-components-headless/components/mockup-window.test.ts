import { afterEach, describe, expect, test } from "vitest";

import { MockupWindow } from "./mockup-window.js";

if (!customElements.get("lily-mockup-window")) {
    customElements.define("lily-mockup-window", MockupWindow);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MockupWindow", () => {
    test("the custom element itself is the frame (self-is-the-wrapper)", () => {
        const host = render("<lily-mockup-window><p>Content</p></lily-mockup-window>");

        expect(host.className).toBe("mockup-window");
    });

    test("label is optional and maps to aria-label when provided", () => {
        const host = render('<lily-mockup-window label="Preview of the settings window"></lily-mockup-window>');

        expect(host.getAttribute("aria-label")).toBe("Preview of the settings window");
    });

    test("omits aria-label when label is not provided", () => {
        const host = render("<lily-mockup-window></lily-mockup-window>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("keeps children in place", () => {
        const host = render("<lily-mockup-window><p>Content</p></lily-mockup-window>");

        expect(host.querySelector("p")!.textContent).toBe("Content");
    });

    test("applies the consumer's class hook alongside the base class", () => {
        const host = render('<lily-mockup-window class="extra"></lily-mockup-window>');

        expect(host.className).toBe("mockup-window extra");
    });
});

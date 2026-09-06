import { afterEach, describe, expect, test } from "vitest";

import { MockupWatch } from "./mockup-watch.js";

if (!customElements.get("lily-mockup-watch")) {
    customElements.define("lily-mockup-watch", MockupWatch);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MockupWatch", () => {
    test("the custom element itself is the frame (self-is-the-wrapper)", () => {
        const host = render("<lily-mockup-watch><p>Content</p></lily-mockup-watch>");

        expect(host.className).toBe("mockup-watch");
    });

    test("label is optional and maps to aria-label when provided", () => {
        const host = render('<lily-mockup-watch label="Preview of the watch face"></lily-mockup-watch>');

        expect(host.getAttribute("aria-label")).toBe("Preview of the watch face");
    });

    test("omits aria-label when label is not provided", () => {
        const host = render("<lily-mockup-watch></lily-mockup-watch>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("keeps children in place", () => {
        const host = render("<lily-mockup-watch><p>Content</p></lily-mockup-watch>");

        expect(host.querySelector("p")!.textContent).toBe("Content");
    });

    test("applies the consumer's class hook alongside the base class", () => {
        const host = render('<lily-mockup-watch class="extra"></lily-mockup-watch>');

        expect(host.className).toBe("mockup-watch extra");
    });
});

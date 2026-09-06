import { afterEach, describe, expect, test } from "vitest";

import { Framer } from "./framer.js";

if (!customElements.get("lily-framer")) {
    customElements.define("lily-framer", Framer);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Framer", () => {
    test("renders as itself with the base class", () => {
        const host = render("<lily-framer><img src=\"a.jpg\" alt=\"A\" /></lily-framer>");

        expect(host.tagName.toLowerCase()).toBe("lily-framer");
        expect(host.className).toBe("framer");
    });

    test("applies aria-label when label is provided", () => {
        const host = render('<lily-framer label="Screenshot of the dashboard"></lily-framer>');

        expect(host.getAttribute("aria-label")).toBe("Screenshot of the dashboard");
    });

    test("omits aria-label when label is not provided", () => {
        const host = render("<lily-framer></lily-framer>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("preserves child content in place", () => {
        const host = render('<lily-framer><img src="a.jpg" alt="A" /></lily-framer>');

        expect(host.querySelector("img")).not.toBeNull();
    });

    test("appends the consumer's class hook to the base class", () => {
        const host = render('<lily-framer class="polaroid"></lily-framer>');

        expect(host.className).toBe("framer polaroid");
    });
});

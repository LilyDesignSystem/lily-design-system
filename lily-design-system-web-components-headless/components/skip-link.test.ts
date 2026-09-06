import { afterEach, describe, expect, test } from "vitest";

import { SkipLink } from "./skip-link.js";

if (!customElements.get("lily-skip-link")) {
    customElements.define("lily-skip-link", SkipLink);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SkipLink", () => {
    test("defaults href to #content and label to 'Skip to content'", () => {
        const host = render("<lily-skip-link></lily-skip-link>");

        const a = host.querySelector("a") as HTMLAnchorElement;
        expect(a.className).toBe("skip-link");
        expect(a.getAttribute("href")).toBe("#content");
        expect(a.textContent).toBe("Skip to content");
    });

    test("allows a configurable href and label", () => {
        const host = render('<lily-skip-link href="#main" label="Skip to main content"></lily-skip-link>');

        const a = host.querySelector("a")!;
        expect(a.getAttribute("href")).toBe("#main");
        expect(a.textContent).toBe("Skip to main content");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-skip-link class="extra"></lily-skip-link>');

        expect(host.querySelector("a")!.className).toBe("skip-link extra");
    });

    test("passes through rest attributes", () => {
        const host = render('<lily-skip-link data-testid="skip-link"></lily-skip-link>');

        expect(host.querySelector("a")!.getAttribute("data-testid")).toBe("skip-link");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-skip-link></lily-skip-link>");

        (host as unknown as SkipLink).connectedCallback();

        expect(host.querySelectorAll("a.skip-link").length).toBe(1);
    });
});

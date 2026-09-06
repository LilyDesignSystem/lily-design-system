import { afterEach, describe, expect, test, vi } from "vitest";

import { GovernmentBanner } from "./government-banner.js";

if (!customElements.get("lily-government-banner")) {
    customElements.define("lily-government-banner", GovernmentBanner);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const ATTRS = 'label="Official government website" header-text="An official website of the government" expand-label="Here\'s how you know"';

describe("GovernmentBanner", () => {
    test("renders a native aside with the base class", () => {
        const host = render(`<lily-government-banner ${ATTRS}><p>Details.</p></lily-government-banner>`);

        expect(host.querySelector("aside")!.className).toBe("government-banner");
    });

    test("uses label as the accessible name", () => {
        const host = render(`<lily-government-banner ${ATTRS}><p>Details.</p></lily-government-banner>`);

        expect(host.querySelector("aside")!.getAttribute("aria-label")).toBe("Official government website");
    });

    test("renders header-text and expand-label", () => {
        const host = render(`<lily-government-banner ${ATTRS}><p>Details.</p></lily-government-banner>`);

        expect(host.querySelector(".government-banner-text")!.textContent).toBe("An official website of the government");
        expect(host.querySelector(".government-banner-toggle")!.textContent).toBe("Here's how you know");
    });

    test("toggle button has aria-expanded and aria-controls, panel hidden by default", () => {
        const host = render(`<lily-government-banner ${ATTRS}><p>Details.</p></lily-government-banner>`);

        const toggle = host.querySelector(".government-banner-toggle")!;
        const panel = host.querySelector(".government-banner-details") as HTMLElement;
        expect(toggle.getAttribute("aria-expanded")).toBe("false");
        expect(toggle.getAttribute("aria-controls")).toBe(panel.id);
        expect(panel.hidden).toBe(true);
    });

    test("expanded shows the panel", () => {
        const host = render(`<lily-government-banner ${ATTRS} expanded><p>Details.</p></lily-government-banner>`);

        expect((host.querySelector(".government-banner-details") as HTMLElement).hidden).toBe(false);
        expect(host.querySelector(".government-banner-toggle")!.getAttribute("aria-expanded")).toBe("true");
    });

    test("moves the consumer's children into the details panel", () => {
        const host = render(`<lily-government-banner ${ATTRS}><p>Details content.</p></lily-government-banner>`);

        expect(host.querySelector(".government-banner-details p")!.textContent).toBe("Details content.");
    });

    test("clicking the toggle flips expanded and fires lily-toggle", () => {
        const host = render(`<lily-government-banner ${ATTRS}><p>Details.</p></lily-government-banner>`);
        const handler = vi.fn();
        host.addEventListener("lily-toggle", handler);

        (host.querySelector(".government-banner-toggle") as HTMLButtonElement).click();

        expect(host.hasAttribute("expanded")).toBe(true);
        expect(handler).toHaveBeenCalled();
        expect((host.querySelector(".government-banner-details") as HTMLElement).hidden).toBe(false);
    });
});

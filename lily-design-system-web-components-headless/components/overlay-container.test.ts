import { afterEach, describe, expect, test, vi } from "vitest";

import { OverlayContainer } from "./overlay-container.js";

if (!customElements.get("lily-overlay-container")) {
    customElements.define("lily-overlay-container", OverlayContainer);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("OverlayContainer", () => {
    test("the custom element itself is the backdrop (self-is-the-wrapper)", () => {
        const host = render("<lily-overlay-container></lily-overlay-container>");

        expect(host.className).toBe("overlay-container");
        expect(host.getAttribute("role")).toBe("presentation");
    });

    test("defaults closed: data-open=false, aria-hidden=true, hidden", () => {
        const host = render("<lily-overlay-container></lily-overlay-container>");

        expect(host.getAttribute("data-open")).toBe("false");
        expect(host.getAttribute("aria-hidden")).toBe("true");
        expect(host.hidden).toBe(true);
    });

    test("open attribute switches to data-open=true, aria-hidden=false, not hidden", () => {
        const host = render("<lily-overlay-container open></lily-overlay-container>");

        expect(host.getAttribute("data-open")).toBe("true");
        expect(host.getAttribute("aria-hidden")).toBe("false");
        expect(host.hidden).toBe(false);
    });

    test("toggling open externally re-syncs the attributes", () => {
        const host = render("<lily-overlay-container></lily-overlay-container>");

        host.toggleAttribute("open", true);

        expect(host.getAttribute("data-open")).toBe("true");
        expect(host.hidden).toBe(false);
    });

    test("label is optional and maps to aria-label when provided", () => {
        const host = render('<lily-overlay-container label="Modal backdrop"></lily-overlay-container>');

        expect(host.getAttribute("aria-label")).toBe("Modal backdrop");
    });

    test("clicking the backdrop itself fires lily-close", () => {
        const host = render('<lily-overlay-container open><div role="dialog">Content</div></lily-overlay-container>');
        const handler = vi.fn();
        host.addEventListener("lily-close", handler);

        host.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        expect(handler).toHaveBeenCalled();
    });

    test("clicking a child does not fire lily-close", () => {
        const host = render('<lily-overlay-container open><div role="dialog">Content</div></lily-overlay-container>');
        const handler = vi.fn();
        host.addEventListener("lily-close", handler);

        (host.querySelector("[role=dialog]") as HTMLElement).dispatchEvent(new MouseEvent("click", { bubbles: true }));

        expect(handler).not.toHaveBeenCalled();
    });

    test("applies the consumer's class hook alongside the base class", () => {
        const host = render('<lily-overlay-container class="extra"></lily-overlay-container>');

        expect(host.className).toBe("overlay-container extra");
    });
});

import { afterEach, describe, expect, test, vi } from "vitest";

import { SlideOutDrawer } from "./slide-out-drawer.js";

if (!customElements.get("lily-slide-out-drawer")) {
    customElements.define("lily-slide-out-drawer", SlideOutDrawer);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SlideOutDrawer", () => {
    test("carries the base class", () => {
        const host = render('<lily-slide-out-drawer label="Navigation menu" open></lily-slide-out-drawer>');

        expect(host.classList.contains("slide-out-drawer")).toBe(true);
    });

    test("has role=dialog and aria-modal=true", () => {
        const host = render('<lily-slide-out-drawer label="Navigation menu" open></lily-slide-out-drawer>');

        expect(host.getAttribute("role")).toBe("dialog");
        expect(host.getAttribute("aria-modal")).toBe("true");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-slide-out-drawer label="Navigation menu" open></lily-slide-out-drawer>');

        expect(host.getAttribute("aria-label")).toBe("Navigation menu");
    });

    test("is programmatically focusable via tabindex=-1", () => {
        const host = render('<lily-slide-out-drawer label="Navigation menu" open></lily-slide-out-drawer>');

        expect(host.tabIndex).toBe(-1);
    });

    test("is hidden when open is absent, visible when present", () => {
        const host = render('<lily-slide-out-drawer label="Navigation menu"></lily-slide-out-drawer>');
        expect(host.hidden).toBe(true);

        host.toggleAttribute("open", true);
        expect(host.hidden).toBe(false);
    });

    test("Escape closes the drawer and dispatches lily-close", () => {
        const host = render('<lily-slide-out-drawer label="Navigation menu" open></lily-slide-out-drawer>');
        const handler = vi.fn();
        host.addEventListener("lily-close", handler);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

        expect(host.hasAttribute("open")).toBe(false);
        expect(host.hidden).toBe(true);
        expect(handler).toHaveBeenCalled();
    });

    test("keeps consumer content in place", () => {
        const host = render('<lily-slide-out-drawer label="Navigation menu" open><nav>Menu content</nav></lily-slide-out-drawer>');

        expect(host.querySelector("nav")?.textContent).toBe("Menu content");
    });
});

import { afterEach, describe, expect, test } from "vitest";

import { Drawer } from "./drawer.js";

if (!customElements.get("lily-drawer")) {
    customElements.define("lily-drawer", Drawer);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Drawer", () => {
    test("carries the base class, role=dialog, aria-modal=true, tabindex=-1", () => {
        const host = render('<lily-drawer label="Navigation"></lily-drawer>');

        expect(host.className).toBe("drawer");
        expect(host.getAttribute("role")).toBe("dialog");
        expect(host.getAttribute("aria-modal")).toBe("true");
        expect(host.tabIndex).toBe(-1);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-drawer label="Navigation"></lily-drawer>');

        expect(host.getAttribute("aria-label")).toBe("Navigation");
    });

    test("is hidden by default and visible when open", () => {
        const closed = render('<lily-drawer label="Navigation"></lily-drawer>');
        expect(closed.hidden).toBe(true);

        const open = render('<lily-drawer label="Navigation" open></lily-drawer>');
        expect(open.hidden).toBe(false);
    });

    test("defaults data-side to left and reflects the side attribute", () => {
        const host = render('<lily-drawer label="Filters" side="right"></lily-drawer>');

        expect(host.getAttribute("data-side")).toBe("right");
    });

    test("Escape closes the drawer", () => {
        const host = render('<lily-drawer label="Navigation" open></lily-drawer>');

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

        expect(host.hasAttribute("open")).toBe(false);
        expect(host.hidden).toBe(true);
    });

    test("toggling the open attribute externally updates visibility", () => {
        const host = render('<lily-drawer label="Navigation"></lily-drawer>');

        host.toggleAttribute("open", true);

        expect(host.hidden).toBe(false);
    });
});

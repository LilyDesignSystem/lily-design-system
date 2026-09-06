import { afterEach, describe, expect, test, vi } from "vitest";

import { Sheet } from "./sheet.js";

if (!customElements.get("lily-sheet")) {
    customElements.define("lily-sheet", Sheet);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Sheet", () => {
    test("carries the base class", () => {
        const host = render('<lily-sheet label="Settings" open></lily-sheet>');

        expect(host.classList.contains("sheet")).toBe(true);
    });

    test("has role=dialog and aria-modal=true", () => {
        const host = render('<lily-sheet label="Settings" open></lily-sheet>');

        expect(host.getAttribute("role")).toBe("dialog");
        expect(host.getAttribute("aria-modal")).toBe("true");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-sheet label="Settings" open></lily-sheet>');

        expect(host.getAttribute("aria-label")).toBe("Settings");
    });

    test("is programmatically focusable via tabindex=-1", () => {
        const host = render('<lily-sheet label="Settings" open></lily-sheet>');

        expect(host.tabIndex).toBe(-1);
    });

    test("defaults data-side to right", () => {
        const host = render('<lily-sheet label="Settings" open></lily-sheet>');

        expect(host.getAttribute("data-side")).toBe("right");
    });

    test("honours an explicit side", () => {
        const host = render('<lily-sheet label="Settings" open side="left"></lily-sheet>');

        expect(host.getAttribute("data-side")).toBe("left");
    });

    test("is hidden when open is absent, visible when present", () => {
        const host = render('<lily-sheet label="Settings"></lily-sheet>');
        expect(host.hidden).toBe(true);

        host.toggleAttribute("open", true);
        expect(host.hidden).toBe(false);
    });

    test("Escape closes the sheet and dispatches lily-close", () => {
        const host = render('<lily-sheet label="Settings" open></lily-sheet>');
        const handler = vi.fn();
        host.addEventListener("lily-close", handler);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

        expect(host.hasAttribute("open")).toBe(false);
        expect(host.hidden).toBe(true);
        expect(handler).toHaveBeenCalled();
    });
});

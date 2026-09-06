import { afterEach, describe, expect, test, vi } from "vitest";

import { ContextMenu } from "./context-menu.js";
import { ContextMenuItem } from "./context-menu-item.js";

if (!customElements.get("lily-context-menu")) {
    customElements.define("lily-context-menu", ContextMenu);
}
if (!customElements.get("lily-context-menu-item")) {
    customElements.define("lily-context-menu-item", ContextMenuItem);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const ITEMS =
    '<lily-context-menu-item>Cut</lily-context-menu-item><lily-context-menu-item>Copy</lily-context-menu-item><lily-context-menu-item>Paste</lily-context-menu-item>';

describe("ContextMenu", () => {
    test("renders with role=menu and the base class", () => {
        const host = render(`<lily-context-menu label="Actions">${ITEMS}</lily-context-menu>`);

        expect(host.getAttribute("role")).toBe("menu");
        expect(host.className).toBe("context-menu");
    });

    test("uses label as the accessible name", () => {
        const host = render(`<lily-context-menu label="Actions">${ITEMS}</lily-context-menu>`);

        expect(host.getAttribute("aria-label")).toBe("Actions");
    });

    test("is hidden by default (open absent)", () => {
        const host = render(`<lily-context-menu label="Actions">${ITEMS}</lily-context-menu>`);

        expect(host.hidden).toBe(true);
    });

    test("open attribute reveals the menu", () => {
        const host = render(`<lily-context-menu label="Actions" open>${ITEMS}</lily-context-menu>`);

        expect(host.hidden).toBe(false);
    });

    test("focuses the first menuitem when opened", () => {
        const host = render(`<lily-context-menu label="Actions">${ITEMS}</lily-context-menu>`);

        host.toggleAttribute("open", true);

        expect(document.activeElement).toBe(host.querySelector("lily-context-menu-item"));
    });

    test("ArrowDown moves focus to the next item, wrapping at the end", () => {
        const host = render(`<lily-context-menu label="Actions" open>${ITEMS}</lily-context-menu>`);
        const items = Array.from(host.querySelectorAll("lily-context-menu-item")) as HTMLElement[];
        items[2]!.focus();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

        expect(document.activeElement).toBe(items[0]);
    });

    test("ArrowUp moves focus to the previous item, wrapping at the start", () => {
        const host = render(`<lily-context-menu label="Actions" open>${ITEMS}</lily-context-menu>`);
        const items = Array.from(host.querySelectorAll("lily-context-menu-item")) as HTMLElement[];
        items[0]!.focus();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));

        expect(document.activeElement).toBe(items[2]);
    });

    test("Home and End jump to the first and last item", () => {
        const host = render(`<lily-context-menu label="Actions" open>${ITEMS}</lily-context-menu>`);
        const items = Array.from(host.querySelectorAll("lily-context-menu-item")) as HTMLElement[];

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
        expect(document.activeElement).toBe(items[2]);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
        expect(document.activeElement).toBe(items[0]);
    });

    test("Escape closes the menu and fires lily-close", () => {
        const host = render(`<lily-context-menu label="Actions" open>${ITEMS}</lily-context-menu>`);
        const handler = vi.fn();
        host.addEventListener("lily-close", handler);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

        expect(host.hasAttribute("open")).toBe(false);
        expect(host.hidden).toBe(true);
        expect(handler).toHaveBeenCalledOnce();
    });
});

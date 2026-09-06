import { afterEach, describe, expect, test, vi } from "vitest";

import { DropdownMenu } from "./dropdown-menu.js";

if (!customElements.get("lily-dropdown-menu")) {
    customElements.define("lily-dropdown-menu", DropdownMenu);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const ITEMS =
    '<li role="menuitem" tabindex="-1">Edit</li><li role="menuitem" tabindex="-1">Duplicate</li><li role="menuitem" tabindex="-1">Delete</li>';

describe("DropdownMenu", () => {
    test("renders a trigger button and a menu panel", () => {
        const host = render(`<lily-dropdown-menu label="Options">${ITEMS}</lily-dropdown-menu>`);

        expect(host.querySelector("button")).toBeTruthy();
        expect(host.querySelector("[role='menu']")).toBeTruthy();
    });

    test("the trigger button displays label text and uses it as aria-label", () => {
        const host = render(`<lily-dropdown-menu label="Options">${ITEMS}</lily-dropdown-menu>`);

        const button = host.querySelector("button")!;
        expect(button.textContent).toBe("Options");
        expect(button.getAttribute("aria-label")).toBe("Options");
        expect(button.getAttribute("aria-haspopup")).toBe("true");
    });

    test("aria-expanded reflects the open attribute", () => {
        const host = render(`<lily-dropdown-menu label="Options">${ITEMS}</lily-dropdown-menu>`);

        expect(host.querySelector("button")!.getAttribute("aria-expanded")).toBe("false");

        host.toggleAttribute("open", true);

        expect(host.querySelector("button")!.getAttribute("aria-expanded")).toBe("true");
    });

    test("the menu is hidden until open", () => {
        const host = render(`<lily-dropdown-menu label="Options">${ITEMS}</lily-dropdown-menu>`);

        expect((host.querySelector("[role='menu']") as HTMLElement).hidden).toBe(true);

        host.toggleAttribute("open", true);

        expect((host.querySelector("[role='menu']") as HTMLElement).hidden).toBe(false);
    });

    test("clicking the button toggles open", () => {
        const host = render(`<lily-dropdown-menu label="Options">${ITEMS}</lily-dropdown-menu>`);

        host.querySelector("button")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        expect(host.hasAttribute("open")).toBe(true);
    });

    test("focuses the first menuitem when opened", () => {
        const host = render(`<lily-dropdown-menu label="Options">${ITEMS}</lily-dropdown-menu>`);

        host.toggleAttribute("open", true);

        expect(document.activeElement).toBe(host.querySelector("[role='menuitem']"));
    });

    test("ArrowDown / ArrowUp navigate with wrapping", () => {
        const host = render(`<lily-dropdown-menu label="Options" open>${ITEMS}</lily-dropdown-menu>`);
        const menu = host.querySelector("[role='menu']")!;
        const items = Array.from(host.querySelectorAll("[role='menuitem']")) as HTMLElement[];
        items[0]!.focus();

        menu.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
        expect(document.activeElement).toBe(items[2]);

        menu.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        expect(document.activeElement).toBe(items[0]);
    });

    test("Home and End jump to first and last item", () => {
        const host = render(`<lily-dropdown-menu label="Options" open>${ITEMS}</lily-dropdown-menu>`);
        const menu = host.querySelector("[role='menu']")!;
        const items = Array.from(host.querySelectorAll("[role='menuitem']")) as HTMLElement[];

        menu.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
        expect(document.activeElement).toBe(items[2]);

        menu.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
        expect(document.activeElement).toBe(items[0]);
    });

    test("Escape closes the menu, returns focus to the button, and fires lily-close", () => {
        const host = render(`<lily-dropdown-menu label="Options" open>${ITEMS}</lily-dropdown-menu>`);
        const handler = vi.fn();
        host.addEventListener("lily-close", handler);
        const menu = host.querySelector("[role='menu']")!;

        menu.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

        expect(host.hasAttribute("open")).toBe(false);
        expect(document.activeElement).toBe(host.querySelector("button"));
        expect(handler).toHaveBeenCalledOnce();
    });
});

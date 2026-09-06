import { afterEach, describe, expect, test } from "vitest";

import { Menu } from "./menu.js";

if (!customElements.get("lily-menu")) {
    customElements.define("lily-menu", Menu);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Menu", () => {
    test("the host itself carries role=menu", () => {
        const host = render('<lily-menu label="Actions"></lily-menu>');

        expect(host.getAttribute("role")).toBe("menu");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-menu label="Actions"></lily-menu>');

        expect(host.getAttribute("aria-label")).toBe("Actions");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-menu label="Actions" class="extra"></lily-menu>');

        expect(host.className).toBe("menu extra");
    });

    test("children are left in place (self-is-the-wrapper)", () => {
        const host = render(
            '<lily-menu label="Actions"><div role="menuitem" tabindex="-1">Cut</div></lily-menu>',
        );

        expect(host.querySelector(":scope > [role='menuitem']")!.textContent).toBe("Cut");
    });

    test("ArrowDown moves focus to the next menu item, wrapping to the first", () => {
        const host = render(
            '<lily-menu label="Actions">' +
                '<div role="menuitem" tabindex="0">Cut</div>' +
                '<div role="menuitem" tabindex="-1">Copy</div>' +
                "</lily-menu>",
        );
        const items = host.querySelectorAll<HTMLElement>("[role='menuitem']");
        items[0].focus();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        expect(document.activeElement).toBe(items[1]);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        expect(document.activeElement).toBe(items[0]);
    });

    test("ArrowUp moves focus to the previous menu item, wrapping to the last", () => {
        const host = render(
            '<lily-menu label="Actions">' +
                '<div role="menuitem" tabindex="0">Cut</div>' +
                '<div role="menuitem" tabindex="-1">Copy</div>' +
                "</lily-menu>",
        );
        const items = host.querySelectorAll<HTMLElement>("[role='menuitem']");
        items[0].focus();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
        expect(document.activeElement).toBe(items[1]);
    });

    test("Home and End jump to the first and last menu items", () => {
        const host = render(
            '<lily-menu label="Actions">' +
                '<div role="menuitem" tabindex="0">Cut</div>' +
                '<div role="menuitem" tabindex="-1">Copy</div>' +
                '<div role="menuitem" tabindex="-1">Paste</div>' +
                "</lily-menu>",
        );
        const items = host.querySelectorAll<HTMLElement>("[role='menuitem']");
        items[1].focus();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
        expect(document.activeElement).toBe(items[2]);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
        expect(document.activeElement).toBe(items[0]);
    });
});

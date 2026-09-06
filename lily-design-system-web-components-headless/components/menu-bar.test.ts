import { afterEach, describe, expect, test } from "vitest";

import { MenuBar } from "./menu-bar.js";

if (!customElements.get("lily-menu-bar")) {
    customElements.define("lily-menu-bar", MenuBar);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MenuBar", () => {
    test("the host itself carries role=menubar", () => {
        const host = render('<lily-menu-bar label="Main menu"></lily-menu-bar>');

        expect(host.getAttribute("role")).toBe("menubar");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-menu-bar label="Main menu"></lily-menu-bar>');

        expect(host.getAttribute("aria-label")).toBe("Main menu");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-menu-bar label="Main menu" class="extra"></lily-menu-bar>');

        expect(host.className).toBe("menu-bar extra");
    });

    test("ArrowRight moves focus to the next item, wrapping to the first", () => {
        const host = render(
            '<lily-menu-bar label="Main menu">' +
                '<button role="menuitem" tabindex="0">File</button>' +
                '<button role="menuitem" tabindex="-1">Edit</button>' +
                "</lily-menu-bar>",
        );
        const items = host.querySelectorAll<HTMLElement>("[role='menuitem']");
        items[0].focus();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(document.activeElement).toBe(items[1]);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(document.activeElement).toBe(items[0]);
    });

    test("ArrowLeft moves focus to the previous item, wrapping to the last", () => {
        const host = render(
            '<lily-menu-bar label="Main menu">' +
                '<button role="menuitem" tabindex="0">File</button>' +
                '<button role="menuitem" tabindex="-1">Edit</button>' +
                "</lily-menu-bar>",
        );
        const items = host.querySelectorAll<HTMLElement>("[role='menuitem']");
        items[0].focus();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
        expect(document.activeElement).toBe(items[1]);
    });

    test("Home and End jump to the first and last items", () => {
        const host = render(
            '<lily-menu-bar label="Main menu">' +
                '<button role="menuitem" tabindex="0">File</button>' +
                '<button role="menuitem" tabindex="-1">Edit</button>' +
                '<button role="menuitem" tabindex="-1">View</button>' +
                "</lily-menu-bar>",
        );
        const items = host.querySelectorAll<HTMLElement>("[role='menuitem']");
        items[1].focus();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
        expect(document.activeElement).toBe(items[2]);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
        expect(document.activeElement).toBe(items[0]);
    });
});

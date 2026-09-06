import { afterEach, describe, expect, test, vi } from "vitest";

import { SplitButton } from "./split-button.js";

if (!customElements.get("lily-split-button")) {
    customElements.define("lily-split-button", SplitButton);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SplitButton", () => {
    test("the host itself carries the base class and role=group", () => {
        const host = render(
            '<lily-split-button label="Save options" primary-label="Save" menu-label="More save options"></lily-split-button>',
        );

        expect(host.className).toBe("split-button");
        expect(host.getAttribute("role")).toBe("group");
        expect(host.getAttribute("aria-label")).toBe("Save options");
    });

    test("renders the primary button with its label text", () => {
        const host = render(
            '<lily-split-button label="Save options" primary-label="Save" menu-label="More save options"></lily-split-button>',
        );

        const primary = host.querySelector(".split-button-primary") as HTMLButtonElement;
        expect(primary.tagName).toBe("BUTTON");
        expect(primary.textContent).toBe("Save");
    });

    test("renders the menu trigger with aria-haspopup and aria-label", () => {
        const host = render(
            '<lily-split-button label="Save options" primary-label="Save" menu-label="More save options"></lily-split-button>',
        );

        const trigger = host.querySelector(".split-button-menu-trigger") as HTMLButtonElement;
        expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
        expect(trigger.getAttribute("aria-label")).toBe("More save options");
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
    });

    test("the menu container starts hidden and holds the host's children", () => {
        const host = render(
            '<lily-split-button label="Save options" primary-label="Save" menu-label="More save options">' +
                '<div role="menuitem">Save as draft</div>' +
                "</lily-split-button>",
        );

        const menu = host.querySelector(".split-button-menu") as HTMLDivElement;
        expect(menu.hidden).toBe(true);
        expect(menu.querySelector('[role="menuitem"]')).toBeTruthy();
    });

    test("clicking the trigger opens the menu and sets aria-expanded", () => {
        const host = render(
            '<lily-split-button label="Save options" primary-label="Save" menu-label="More save options"></lily-split-button>',
        );
        const trigger = host.querySelector(".split-button-menu-trigger") as HTMLButtonElement;
        const menu = host.querySelector(".split-button-menu") as HTMLDivElement;

        trigger.click();

        expect(trigger.getAttribute("aria-expanded")).toBe("true");
        expect(menu.hidden).toBe(false);
    });

    test("Escape closes the menu and returns focus to the trigger", () => {
        const host = render(
            '<lily-split-button label="Save options" primary-label="Save" menu-label="More save options"></lily-split-button>',
        );
        const trigger = host.querySelector(".split-button-menu-trigger") as HTMLButtonElement;
        trigger.click();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        expect((host.querySelector(".split-button-menu") as HTMLDivElement).hidden).toBe(true);
    });

    test("menu-open seeds the initial open state", () => {
        const host = render(
            '<lily-split-button label="Save options" primary-label="Save" menu-label="More save options" menu-open></lily-split-button>',
        );

        const trigger = host.querySelector(".split-button-menu-trigger") as HTMLButtonElement;
        const menu = host.querySelector(".split-button-menu") as HTMLDivElement;
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
        expect(menu.hidden).toBe(false);
    });

    test("disabled propagates to both buttons", () => {
        const host = render(
            '<lily-split-button label="Save options" primary-label="Save" menu-label="More save options" disabled></lily-split-button>',
        );

        expect((host.querySelector(".split-button-primary") as HTMLButtonElement).disabled).toBe(true);
        expect((host.querySelector(".split-button-menu-trigger") as HTMLButtonElement).disabled).toBe(true);
    });

    test("clicking the primary button fires a bubbling lily-primary-click event", () => {
        const host = render(
            '<lily-split-button label="Save options" primary-label="Save" menu-label="More save options"></lily-split-button>',
        );
        const handler = vi.fn();
        host.addEventListener("lily-primary-click", handler);

        (host.querySelector(".split-button-primary") as HTMLButtonElement).click();

        expect(handler).toHaveBeenCalledTimes(1);
    });

    test("toggling the menu fires a lily-menu-toggle event with the open state", () => {
        const host = render(
            '<lily-split-button label="Save options" primary-label="Save" menu-label="More save options"></lily-split-button>',
        );
        const handler = vi.fn();
        host.addEventListener("lily-menu-toggle", handler);

        (host.querySelector(".split-button-menu-trigger") as HTMLButtonElement).click();

        expect(handler).toHaveBeenCalledTimes(1);
        expect((handler.mock.calls[0][0] as CustomEvent).detail).toEqual({ open: true });
    });
});

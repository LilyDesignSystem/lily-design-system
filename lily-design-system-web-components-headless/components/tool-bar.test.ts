import { afterEach, describe, expect, test } from "vitest";

import { ToolBar } from "./tool-bar.js";
import { ToolBarButton } from "./tool-bar-button.js";

if (!customElements.get("lily-tool-bar")) {
    customElements.define("lily-tool-bar", ToolBar);
}
if (!customElements.get("lily-tool-bar-button")) {
    customElements.define("lily-tool-bar-button", ToolBarButton);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

function barMarkup(): string {
    return (
        '<lily-tool-bar label="Text formatting">' +
        "<lily-tool-bar-button>Bold</lily-tool-bar-button>" +
        "<lily-tool-bar-button>Italic</lily-tool-bar-button>" +
        "<lily-tool-bar-button>Underline</lily-tool-bar-button>" +
        "</lily-tool-bar>"
    );
}

describe("ToolBar", () => {
    test("renders itself with the base class and role=toolbar", () => {
        const host = render(barMarkup());

        expect(host.classList.contains("tool-bar")).toBe(true);
        expect(host.getAttribute("role")).toBe("toolbar");
    });

    test("uses label as the accessible name", () => {
        const host = render(barMarkup());

        expect(host.getAttribute("aria-label")).toBe("Text formatting");
    });

    test("ArrowRight moves focus to the next button, wrapping to the first", () => {
        const host = render(barMarkup());
        const buttons = host.querySelectorAll<HTMLElement>("button");
        buttons[0].focus();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(document.activeElement).toBe(buttons[1]);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(document.activeElement).toBe(buttons[2]);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(document.activeElement).toBe(buttons[0]);
    });

    test("ArrowLeft moves focus to the previous button, wrapping to the last", () => {
        const host = render(barMarkup());
        const buttons = host.querySelectorAll<HTMLElement>("button");
        buttons[0].focus();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
        expect(document.activeElement).toBe(buttons[2]);
    });

    test("Home and End jump to the first and last button", () => {
        const host = render(barMarkup());
        const buttons = host.querySelectorAll<HTMLElement>("button");
        buttons[1].focus();

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
        expect(document.activeElement).toBe(buttons[2]);

        host.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
        expect(document.activeElement).toBe(buttons[0]);
    });

    test("appends the consumer's class attribute to the base class", () => {
        const host = render('<lily-tool-bar label="Tools" class="my-extra"></lily-tool-bar>');

        expect(host.className).toBe("tool-bar my-extra");
    });
});

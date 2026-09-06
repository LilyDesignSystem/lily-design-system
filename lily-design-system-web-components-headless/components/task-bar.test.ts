import { afterEach, describe, expect, test } from "vitest";

import { TaskBar } from "./task-bar.js";
import { TaskBarButton } from "./task-bar-button.js";

if (!customElements.get("lily-task-bar")) {
    customElements.define("lily-task-bar", TaskBar);
}
if (!customElements.get("lily-task-bar-button")) {
    customElements.define("lily-task-bar-button", TaskBarButton);
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
        '<lily-task-bar label="Document actions">' +
        "<lily-task-bar-button>New</lily-task-bar-button>" +
        "<lily-task-bar-button>Open</lily-task-bar-button>" +
        "<lily-task-bar-button>Save</lily-task-bar-button>" +
        "</lily-task-bar>"
    );
}

describe("TaskBar", () => {
    test("renders itself with the base class and role=toolbar", () => {
        const host = render(barMarkup());

        expect(host.classList.contains("task-bar")).toBe(true);
        expect(host.getAttribute("role")).toBe("toolbar");
    });

    test("uses label as the accessible name", () => {
        const host = render(barMarkup());

        expect(host.getAttribute("aria-label")).toBe("Document actions");
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
        const host = render('<lily-task-bar label="Tasks" class="my-extra"></lily-task-bar>');

        expect(host.className).toBe("task-bar my-extra");
    });
});

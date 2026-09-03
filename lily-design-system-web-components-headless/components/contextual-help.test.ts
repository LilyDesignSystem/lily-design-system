import { afterEach, describe, expect, test, vi } from "vitest";

import { ContextualHelp } from "./contextual-help.js";

if (!customElements.get("lily-contextual-help")) {
    customElements.define("lily-contextual-help", ContextualHelp);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ContextualHelp", () => {
    test("the custom element itself carries the base class (self-is-the-wrapper)", () => {
        const host = render('<lily-contextual-help label="What is this?">Help text.</lily-contextual-help>');

        expect(host.className).toBe("contextual-help");
    });

    test("renders a trigger button with aria-haspopup=dialog and the label", () => {
        const host = render('<lily-contextual-help label="What is this?">Help text.</lily-contextual-help>');

        const trigger = host.querySelector(".contextual-help-trigger") as HTMLButtonElement;
        expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
        expect(trigger.getAttribute("aria-label")).toBe("What is this?");
    });

    test("moves original content into the panel, hidden by default", () => {
        const host = render('<lily-contextual-help label="What is this?">Help text.</lily-contextual-help>');

        const panel = host.querySelector(".contextual-help-panel") as HTMLDivElement;
        expect(panel.textContent).toBe("Help text.");
        expect(panel.hidden).toBe(true);
        expect(panel.getAttribute("role")).toBe("dialog");
    });

    test("trigger aria-controls references the panel's id", () => {
        const host = render('<lily-contextual-help label="What is this?">Help text.</lily-contextual-help>');

        const trigger = host.querySelector(".contextual-help-trigger") as HTMLButtonElement;
        const panel = host.querySelector(".contextual-help-panel") as HTMLDivElement;
        expect(trigger.getAttribute("aria-controls")).toBe(panel.id);
    });

    test("clicking the trigger opens the panel, sets aria-expanded, and dispatches lily-click", () => {
        const host = render('<lily-contextual-help label="What is this?">Help text.</lily-contextual-help>');
        const trigger = host.querySelector(".contextual-help-trigger") as HTMLButtonElement;
        const panel = host.querySelector(".contextual-help-panel") as HTMLDivElement;
        const handler = vi.fn();
        host.addEventListener("lily-click", handler);

        trigger.click();

        expect(host.hasAttribute("expanded")).toBe(true);
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
        expect(panel.hidden).toBe(false);
        expect(handler).toHaveBeenCalled();
    });
});

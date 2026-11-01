import { afterEach, describe, expect, test, vi } from "vitest";

import { ContextualHelp } from "./contextual-help.js";

if (!customElements.get("lily-contextual-help")) {
    customElements.define("lily-contextual-help", ContextualHelp);
}

afterEach(() => {
    document.body.innerHTML = "";
});

type Proto = { showPopover?: () => void; hidePopover?: () => void };

/** Run with showPopover/hidePopover stubbed, as in a browser with the Popover API (jsdom has none). */
function withPopoverApi(run: () => void): void {
    const proto = HTMLElement.prototype as unknown as Proto;
    proto.showPopover = vi.fn();
    proto.hidePopover = vi.fn();
    try {
        run();
    } finally {
        delete proto.showPopover;
        delete proto.hidePopover;
    }
}

function fireToggle(node: Element, newState: "open" | "closed"): void {
    const event = new Event("toggle");
    Object.assign(event, { newState, oldState: newState === "open" ? "closed" : "open" });
    node.dispatchEvent(event);
}

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ContextualHelp", () => {
    test("the custom element itself carries the base class (self-is-the-wrapper)", () => {
        const host = render(
            '<lily-contextual-help label="What is this?" trigger-label="?">Help text.</lily-contextual-help>',
        );

        expect(host.className).toBe("contextual-help");
    });

    test("renders a trigger button with aria-haspopup=dialog and the label", () => {
        const host = render(
            '<lily-contextual-help label="What is this?" trigger-label="?">Help text.</lily-contextual-help>',
        );

        const trigger = host.querySelector(".contextual-help-trigger") as HTMLButtonElement;
        expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
        expect(trigger.getAttribute("aria-label")).toBe("What is this?");
    });

    test("moves original content into the panel, hidden by default", () => {
        const host = render(
            '<lily-contextual-help label="What is this?" trigger-label="?">Help text.</lily-contextual-help>',
        );

        const panel = host.querySelector(".contextual-help-panel") as HTMLDivElement;
        expect(panel.textContent).toBe("Help text.");
        expect(panel.hidden).toBe(true);
        expect(panel.getAttribute("role")).toBe("dialog");
    });

    test("trigger aria-controls references the panel's id", () => {
        const host = render(
            '<lily-contextual-help label="What is this?" trigger-label="?">Help text.</lily-contextual-help>',
        );

        const trigger = host.querySelector(".contextual-help-trigger") as HTMLButtonElement;
        const panel = host.querySelector(".contextual-help-panel") as HTMLDivElement;
        expect(trigger.getAttribute("aria-controls")).toBe(panel.id);
    });

    test("clicking the trigger opens the panel, sets aria-expanded, and dispatches lily-click", () => {
        const host = render(
            '<lily-contextual-help label="What is this?" trigger-label="?">Help text.</lily-contextual-help>',
        );
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

    test("trigger-label is the trigger's visible text", () => {
        const host = render(
            '<lily-contextual-help label="What is this?" trigger-label="؟">Help text.</lily-contextual-help>',
        );

        const trigger = host.querySelector(".contextual-help-trigger") as HTMLButtonElement;
        expect(trigger.textContent).toBe("؟");
        expect(trigger.getAttribute("aria-label")).toBe("What is this?");
    });

    test("trigger names the popover=auto panel with command/commandfor and popovertarget", () => {
        withPopoverApi(() => {
            const host = render(
                '<lily-contextual-help label="What is this?" trigger-label="?">Help text.</lily-contextual-help>',
            );
            const trigger = host.querySelector(".contextual-help-trigger") as HTMLButtonElement;
            const panel = host.querySelector(".contextual-help-panel") as HTMLDivElement;
            expect(panel.getAttribute("popover")).toBe("auto");
            expect(trigger.getAttribute("command")).toBe("toggle-popover");
            expect(trigger.getAttribute("commandfor")).toBe(panel.id);
            expect(trigger.getAttribute("popovertarget")).toBe(panel.id);
        });
    });

    test("with the Popover API the click leaves toggling to the browser; toggle writes expanded", () => {
        withPopoverApi(() => {
            const host = render(
                '<lily-contextual-help label="What is this?" trigger-label="?">Help text.</lily-contextual-help>',
            );
            const trigger = host.querySelector(".contextual-help-trigger") as HTMLButtonElement;
            const panel = host.querySelector(".contextual-help-panel") as HTMLDivElement;
            trigger.click();
            expect(host.hasAttribute("expanded")).toBe(false);
            fireToggle(panel, "open");
            expect(host.hasAttribute("expanded")).toBe(true);
            expect(trigger.getAttribute("aria-expanded")).toBe("true");
            fireToggle(panel, "closed");
            expect(host.hasAttribute("expanded")).toBe(false);
            expect(panel.hidden).toBe(false);
        });
    });
});

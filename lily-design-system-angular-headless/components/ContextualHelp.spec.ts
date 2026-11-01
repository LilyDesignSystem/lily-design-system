import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ContextualHelp } from "./ContextualHelp";

function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(ContextualHelp);
    fixture.componentRef.setInput("label", "Help");
    fixture.componentRef.setInput("triggerLabel", "?");
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    return {
        fixture,
        trigger: root.querySelector(".contextual-help-trigger") as HTMLButtonElement,
        panel: root.querySelector(".contextual-help-panel") as HTMLElement,
    };
}

describe("ContextualHelp", () => {
    test("renders the div root with the base class", () => {
        const { fixture } = create();
        expect(fixture.nativeElement.querySelector("div.contextual-help")).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const { fixture } = create({ className: "extra" });
        const el = fixture.nativeElement.querySelector("div.contextual-help");
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("trigger has the label, the triggerLabel text and the ARIA wiring", () => {
        const { trigger, panel } = create({ triggerLabel: "؟" });
        expect(trigger.getAttribute("aria-label")).toBe("Help");
        expect(trigger.textContent).toBe("؟");
        expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        expect(trigger.getAttribute("aria-controls")).toBe(panel.id);
        expect(panel.getAttribute("role")).toBe("dialog");
    });

    test("trigger names the panel with command/commandfor and popovertarget", () => {
        const { trigger, panel } = create();
        expect(trigger.getAttribute("command")).toBe("toggle-popover");
        expect(trigger.getAttribute("commandfor")).toBe(panel.id);
        expect(trigger.getAttribute("popovertarget")).toBe(panel.id);
    });

    test("without the Popover API, clicking toggles the panel", () => {
        const { fixture, trigger, panel } = create();
        expect(panel.hasAttribute("hidden")).toBe(true);
        trigger.click();
        fixture.detectChanges();
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
        expect(panel.hasAttribute("hidden")).toBe(false);
        trigger.click();
        fixture.detectChanges();
        expect(panel.hasAttribute("hidden")).toBe(true);
    });

    test("triggerClick fires, and preventDefault stops the toggle", () => {
        const { fixture, trigger } = create();
        const spy = vi.fn((event: MouseEvent) => event.preventDefault());
        fixture.componentInstance.triggerClick.subscribe(spy);
        trigger.click();
        fixture.detectChanges();
        expect(spy).toHaveBeenCalledOnce();
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
    });

    describe("with the Popover API", () => {
        const proto = HTMLElement.prototype as unknown as {
            showPopover?: () => void;
            hidePopover?: () => void;
        };
        beforeEach(() => {
            proto.showPopover = vi.fn();
            proto.hidePopover = vi.fn();
        });
        afterEach(() => {
            delete proto.showPopover;
            delete proto.hidePopover;
        });

        test("the click leaves toggling to the browser; the toggle event drives aria-expanded", () => {
            const { fixture, trigger, panel } = create();
            trigger.click();
            fixture.detectChanges();
            expect(trigger.getAttribute("aria-expanded")).toBe("false");
            const event = new Event("toggle");
            Object.assign(event, { newState: "open", oldState: "closed" });
            panel.dispatchEvent(event);
            fixture.detectChanges();
            expect(trigger.getAttribute("aria-expanded")).toBe("true");
            expect(panel.hasAttribute("hidden")).toBe(false);
        });
    });
});

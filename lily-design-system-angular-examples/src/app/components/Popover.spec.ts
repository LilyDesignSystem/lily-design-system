import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { Type } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { Popover, popoverSupported, syncPopover } from "./Popover";
import { Popup } from "./Popup";

type Proto = { showPopover?: () => void; hidePopover?: () => void };
const proto = HTMLElement.prototype as unknown as Proto;

function fireToggle(node: Element, newState: "open" | "closed") {
    const event = new Event("toggle");
    Object.assign(event, { newState, oldState: newState === "open" ? "closed" : "open" });
    node.dispatchEvent(event);
}

const subjects: [string, Type<Popover | Popup>, string][] = [
    ["Popover", Popover, "popover"],
    ["Popup", Popup, "popup"],
];
for (const [name, Subject, cls] of subjects) {
    describe(name, () => {
        test("renders the div root with the base class and role dialog", () => {
            const fixture = TestBed.createComponent(Subject);
            fixture.componentRef.setInput("label", "Info");
            fixture.detectChanges();
            const el = fixture.nativeElement.querySelector(`div.${cls}`);
            expect(el).toBeTruthy();
            expect(el.getAttribute("role")).toBe("dialog");
            expect(el.getAttribute("aria-label")).toBe("Info");
        });

        test("appends the className input to the root class list", () => {
            const fixture = TestBed.createComponent(Subject);
            fixture.componentRef.setInput("className", "extra");
            fixture.detectChanges();
            const el = fixture.nativeElement.querySelector(`div.${cls}`);
            expect(el.classList.contains("extra")).toBe(true);
        });

        test("elementId names the inner popover for a commandfor trigger", () => {
            const fixture = TestBed.createComponent(Subject);
            fixture.componentRef.setInput("elementId", "info");
            fixture.detectChanges();
            expect(fixture.nativeElement.querySelector(`div.${cls}`).id).toBe("info");
        });

        test("without the Popover API, closed is hidden and open is shown", () => {
            const fixture = TestBed.createComponent(Subject);
            fixture.detectChanges();
            const el = fixture.nativeElement.querySelector(`div.${cls}`) as HTMLElement;
            expect(el.hasAttribute("hidden")).toBe(true);
            fixture.componentRef.setInput("open", true);
            fixture.detectChanges();
            expect(el.hasAttribute("hidden")).toBe(false);
        });

        describe("with the Popover API", () => {
            let showPopover: ReturnType<typeof vi.fn>;
            let hidePopover: ReturnType<typeof vi.fn>;
            beforeEach(() => {
                showPopover = vi.fn();
                hidePopover = vi.fn();
                proto.showPopover = showPopover as unknown as () => void;
                proto.hidePopover = hidePopover as unknown as () => void;
            });
            afterEach(() => {
                delete proto.showPopover;
                delete proto.hidePopover;
            });

            test("renders popover=auto and opens with showPopover", () => {
                const fixture = TestBed.createComponent(Subject);
                fixture.componentRef.setInput("open", true);
                fixture.detectChanges();
                const el = fixture.nativeElement.querySelector(`div.${cls}`) as HTMLElement;
                expect(el.getAttribute("popover")).toBe("auto");
                expect(el.hasAttribute("hidden")).toBe(false);
                expect(showPopover).toHaveBeenCalled();
            });

            test("the toggle event (light dismiss, a commandfor trigger) writes back to open", () => {
                const fixture = TestBed.createComponent(Subject);
                fixture.componentRef.setInput("open", true);
                fixture.detectChanges();
                const el = fixture.nativeElement.querySelector(`div.${cls}`) as HTMLElement;
                fireToggle(el, "closed");
                expect(fixture.componentInstance.open()).toBe(false);
                fireToggle(el, "open");
                expect(fixture.componentInstance.open()).toBe(true);
            });
        });
    });
}

describe("syncPopover", () => {
    test("falls back to hidden, dropping popover, without the API", () => {
        const node = document.createElement("div");
        node.setAttribute("popover", "auto");
        expect(popoverSupported(node)).toBe(false);
        syncPopover(node, false);
        expect(node.hasAttribute("hidden")).toBe(true);
        expect(node.hasAttribute("popover")).toBe(false);
    });
});

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Drawer } from "./Drawer";

describe("Drawer", () => {
    test("renders the dialog root with the base class", () => {
        const fixture = TestBed.createComponent(Drawer);
        fixture.componentRef.setInput("open", true);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("dialog.drawer");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Drawer);
        fixture.componentRef.setInput("open", true);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("dialog.drawer");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

function key(el: Element, k: string) {
    const event = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true });
    el.dispatchEvent(event);
    return event;
}

describe("Drawer — dialog contract and Escape", () => {
    function create(inputs: Record<string, unknown> = {}) {
        const fixture = TestBed.createComponent(Drawer);
        for (const [k, v] of Object.entries({ label: "Panel", open: true, ...inputs }))
            fixture.componentRef.setInput(k, v);
        fixture.detectChanges();
        return { fixture, el: fixture.nativeElement.querySelector("dialog.drawer") as HTMLElement };
    }

    test("is a labelled modal dialog that can take focus", () => {
        const { el } = create();
        expect(el.tagName).toBe("DIALOG");
        expect(el.getAttribute("aria-modal")).toBe("true");
        expect(el.getAttribute("aria-label")).toBe("Panel");
        expect(el.getAttribute("tabindex")).toBe("-1");
    });

    test("data-side defaults to left and follows the side input", () => {
        expect(create().el.getAttribute("data-side")).toBe("left");
        expect(create({ side: "bottom" }).el.getAttribute("data-side")).toBe("bottom");
    });

    test("renders nothing while closed", () => {
        const fixture = TestBed.createComponent(Drawer);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector("dialog.drawer")).toBeNull();
    });

    test("Escape closes the panel (open becomes false) and other keys do not", () => {
        const { fixture, el } = create();
        key(el, "Enter");
        fixture.detectChanges();
        expect(fixture.componentInstance.open()).toBe(true);
        expect(key(el, "Escape").defaultPrevented).toBe(true);
        fixture.detectChanges();
        expect(fixture.componentInstance.open()).toBe(false);
        expect(fixture.nativeElement.querySelector("dialog.drawer")).toBeNull();
    });
});

// Modality (tasks.md P18-T6): a <dialog> opened with showModal(). jsdom has no showModal, so it is stubbed on the
// prototype the way a browser behaves; the Tab trap and inert page are the browser's part and need a real engine.
describe("Drawer — real modality", () => {
    const proto = HTMLDialogElement.prototype as unknown as {
        showModal?: () => void;
        close?: () => void;
    };
    let showModal: ReturnType<typeof vi.fn>;
    let close: ReturnType<typeof vi.fn>;
    let trigger: HTMLButtonElement;

    beforeEach(() => {
        showModal = vi.fn(function (this: HTMLDialogElement) {
            this.setAttribute("open", "");
        });
        close = vi.fn(function (this: HTMLDialogElement) {
            this.removeAttribute("open");
        });
        proto.showModal = showModal as unknown as typeof proto.showModal;
        proto.close = close as unknown as typeof proto.close;
        trigger = document.createElement("button");
        document.body.append(trigger);
        trigger.focus();
    });

    afterEach(() => {
        delete proto.showModal;
        delete proto.close;
        trigger.remove();
    });

    function open() {
        const fixture = TestBed.createComponent(Drawer);
        fixture.componentRef.setInput("label", "Panel");
        fixture.componentRef.setInput("open", true);
        fixture.detectChanges();
        return {
            fixture,
            el: fixture.nativeElement.querySelector("dialog.drawer") as HTMLDialogElement,
        };
    }

    test("is a <dialog> opened with showModal() and says aria-modal", () => {
        const { el } = open();
        expect(el.tagName).toBe("DIALOG");
        expect(el.classList.contains("drawer")).toBe(true);
        expect(el.hasAttribute("role")).toBe(false);
        expect(showModal).toHaveBeenCalledTimes(1);
        expect(el.getAttribute("aria-modal")).toBe("true");
    });

    test("opening moves focus inside", () => {
        const { el } = open();
        expect(el.contains(document.activeElement)).toBe(true);
    });

    test("the native cancel event (Escape) closes it", () => {
        const { fixture, el } = open();
        const event = new Event("cancel", { cancelable: true });
        el.dispatchEvent(event);
        fixture.detectChanges();
        expect(event.defaultPrevented).toBe(true);
        expect(fixture.componentInstance.open()).toBe(false);
        expect(fixture.nativeElement.querySelector("dialog.drawer")).toBeNull();
    });

    test("closing calls close() and returns focus to the trigger", () => {
        const { fixture } = open();
        expect(document.activeElement).not.toBe(trigger);
        fixture.componentRef.setInput("open", false);
        fixture.detectChanges();
        expect(close).toHaveBeenCalledTimes(1);
        expect(document.activeElement).toBe(trigger);
    });
});

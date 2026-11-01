import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ScrollBar } from "./ScrollBar";

describe("ScrollBar", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(ScrollBar);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.scroll-bar");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(ScrollBar);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.scroll-bar");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

function key(el: Element, k: string) {
    const event = new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true });
    el.dispatchEvent(event);
    return event;
}

describe("ScrollBar — scrollbar semantics and keys", () => {
    function create(inputs: Record<string, unknown> = {}) {
        const fixture = TestBed.createComponent(ScrollBar);
        for (const [k, v] of Object.entries({ label: "Scroll", ...inputs }))
            fixture.componentRef.setInput(k, v);
        fixture.detectChanges();
        const el: HTMLElement = fixture.nativeElement.querySelector("div.scroll-bar");
        const press = (k: string) => {
            const event = key(el, k);
            fixture.detectChanges();
            return event;
        };
        return { fixture, el, press };
    }

    test("is a focusable, labelled, oriented scrollbar naming what it scrolls", () => {
        const { el } = create({ orientation: "horizontal", controls: "messages" });
        expect(el.getAttribute("role")).toBe("scrollbar");
        expect(el.getAttribute("tabindex")).toBe("0");
        expect(el.getAttribute("aria-label")).toBe("Scroll");
        expect(el.getAttribute("aria-orientation")).toBe("horizontal");
        expect(el.getAttribute("aria-controls")).toBe("messages");
    });

    test("arrow keys move the value by step, clamped to the range", () => {
        const { el, press } = create({ value: 1, step: 2 });
        expect(press("ArrowDown").defaultPrevented).toBe(true);
        expect(el.getAttribute("aria-valuenow")).toBe("3");
        press("ArrowRight");
        expect(el.getAttribute("aria-valuenow")).toBe("5");
        press("ArrowUp");
        press("ArrowLeft");
        press("ArrowLeft");
        expect(el.getAttribute("aria-valuenow")).toBe("0");
    });

    test("Page Up and Page Down move the value by pageStep", () => {
        const { el, press } = create({ value: 50, pageStep: 25 });
        press("PageDown");
        expect(el.getAttribute("aria-valuenow")).toBe("75");
        press("PageDown");
        expect(el.getAttribute("aria-valuenow")).toBe("100");
        press("PageUp");
        expect(el.getAttribute("aria-valuenow")).toBe("75");
    });

    test("Home and End jump to min and max; other keys pass through", () => {
        const { el, press } = create({ value: 40, min: 10, max: 90 });
        expect(el.getAttribute("aria-valuemin")).toBe("10");
        expect(el.getAttribute("aria-valuemax")).toBe("90");
        press("End");
        expect(el.getAttribute("aria-valuenow")).toBe("90");
        press("Home");
        expect(el.getAttribute("aria-valuenow")).toBe("10");
        expect(press("a").defaultPrevented).toBe(false);
    });
});

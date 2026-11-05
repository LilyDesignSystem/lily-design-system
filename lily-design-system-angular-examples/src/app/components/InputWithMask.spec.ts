import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { InputWithMask } from "./InputWithMask";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(InputWithMask);
    for (const [key, value] of Object.entries({ label: "Phone", mask: "___-____", ...inputs })) fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

const type = (el: HTMLInputElement | HTMLTextAreaElement, value: string) => {
    el.value = value;
    el.dispatchEvent(new Event("input"));
};

describe("InputWithMask", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector("div.input-with-mask");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("shows the mask, hidden from assistive technology", () => {
        const root = make().nativeElement;
        expect(root.querySelector("div").getAttribute("data-mask")).toBe("___-____");
        const display = root.querySelector(".input-with-mask-display");
        expect(display.textContent).toBe("___-____");
        expect(display.getAttribute("aria-hidden")).toBe("true");
    });

    test("value is two-way", () => {
        const fixture = make();
        const field = fixture.nativeElement.querySelector("input.input-with-mask-control");
        expect(field.getAttribute("aria-label")).toBe("Phone");
        type(field, "555");
        expect(fixture.componentInstance.value()).toBe("555");
    });
});

import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TextAreaInputWithCharacterCounter } from "./TextAreaInputWithCharacterCounter";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(TextAreaInputWithCharacterCounter);
    for (const [key, value] of Object.entries({ label: "Notes", maxLength: 10, counterTemplate: "{count}/{max}", ...inputs })) fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

const type = (el: HTMLInputElement | HTMLTextAreaElement, value: string) => {
    el.value = value;
    el.dispatchEvent(new Event("input"));
};

describe("TextAreaInputWithCharacterCounter", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector("div.text-area-input-with-character-counter");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("the counter is live and described", () => {
        const root = make({ value: "abc", rows: 4 }).nativeElement;
        const area = root.querySelector("textarea");
        const counter = root.querySelector("span");
        expect(counter.textContent).toBe("3/10");
        expect(counter.getAttribute("aria-live")).toBe("polite");
        expect(area.getAttribute("aria-describedby")).toBe(counter.id);
        expect(area.getAttribute("maxlength")).toBe("10");
        expect(area.getAttribute("rows")).toBe("4");
    });

    test("typing updates the value and the count", async () => {
        const fixture = make();
        type(fixture.nativeElement.querySelector("textarea"), "hello");
        await fixture.whenStable();
        expect(fixture.componentInstance.value()).toBe("hello");
        expect(fixture.nativeElement.querySelector("span").textContent).toBe("5/10");
    });
});

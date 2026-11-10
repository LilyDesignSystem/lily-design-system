import { describe, expect, test, vi } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TextAreaInputWithCharacterCounter } from "./TextAreaInputWithCharacterCounter";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(TextAreaInputWithCharacterCounter);
    for (const [key, value] of Object.entries({
        label: "Notes",
        maxLength: 10,
        counterTemplate: "{count}/{max}",
        ...inputs,
    }))
        fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

const type = (el: HTMLInputElement | HTMLTextAreaElement, value: string) => {
    el.value = value;
    el.dispatchEvent(new Event("input"));
};

describe("TextAreaInputWithCharacterCounter", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector(
            "div.text-area-input-with-character-counter",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("the counter describes the field, and is not live itself", () => {
        const root = make({ value: "abc", rows: 4 }).nativeElement;
        const area = root.querySelector("textarea");
        const counter = root.querySelector("span");
        expect(counter.querySelector('[aria-hidden="true"]').textContent).toBe("3/10");
        expect(counter.querySelector('[role="status"]').textContent).toBe("3/10");
        expect(root.querySelector("[aria-live]")).toBeNull();
        expect(area.getAttribute("aria-describedby")).toBe(counter.id);
        expect(area.getAttribute("maxlength")).toBe("10");
        expect(area.getAttribute("rows")).toBe("4");
    });

    test("typing updates the value and the count", async () => {
        const fixture = make();
        type(fixture.nativeElement.querySelector("textarea"), "hello");
        await fixture.whenStable();
        expect(fixture.componentInstance.value()).toBe("hello");
        expect(fixture.nativeElement.querySelector('span [aria-hidden="true"]').textContent).toBe(
            "5/10",
        );
    });

    test("typing is announced once, after the pause", () => {
        vi.useFakeTimers();
        const fixture = make();
        const area = fixture.nativeElement.querySelector("textarea");
        const status = () => fixture.nativeElement.querySelector('[role="status"]').textContent;
        for (const text of ["a", "ab", "abc"]) {
            type(area, text);
            fixture.detectChanges();
            vi.advanceTimersByTime(300);
        }
        expect(status()).toBe("0/10");
        vi.advanceTimersByTime(1000);
        fixture.detectChanges();
        expect(status()).toBe("3/10");
        vi.useRealTimers();
    });
});

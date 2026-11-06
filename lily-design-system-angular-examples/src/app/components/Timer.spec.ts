import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Timer } from "./Timer";

describe("Timer", () => {
    test("renders the span root with the base class", () => {
        const fixture = TestBed.createComponent(Timer);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.timer");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Timer);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.timer");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=timer, as in Svelte", () => {
        const fixture = TestBed.createComponent(Timer);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".timer");
        expect(el.getAttribute("role")).toBe("timer");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });
});

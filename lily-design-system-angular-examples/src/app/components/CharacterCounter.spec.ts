import { describe, expect, test, vi } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CharacterCounter } from "./CharacterCounter";

describe("CharacterCounter", () => {
    test("renders the <span> root with the base class", () => {
        const fixture = TestBed.createComponent(CharacterCounter);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.character-counter");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(CharacterCounter);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.character-counter");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("the status is a hidden role=status named by label, and the visible count is aria-hidden, as in Svelte", () => {
        const fixture = TestBed.createComponent(CharacterCounter);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const root = fixture.nativeElement.querySelector(".character-counter");
        expect(root.hasAttribute("role")).toBe(false);
        expect(root.hasAttribute("aria-live")).toBe(false);
        const status = root.querySelector(".character-counter-status");
        expect(status.getAttribute("role")).toBe("status");
        expect(status.getAttribute("aria-label")).toBe("Story");
        expect(status.classList.contains("screen-reader-span")).toBe(true);
        expect(root.querySelector(".character-counter-text").getAttribute("aria-hidden")).toBe(
            "true",
        );
    });

    test("a run of changes is announced once, after the pause", () => {
        vi.useFakeTimers();
        const fixture = TestBed.createComponent(CharacterCounter);
        fixture.componentRef.setInput("max", 10);
        fixture.detectChanges();
        const status = () =>
            fixture.nativeElement.querySelector(".character-counter-status").textContent;
        for (const count of [1, 2, 3, 4]) {
            fixture.componentRef.setInput("count", count);
            fixture.detectChanges();
            vi.advanceTimersByTime(300);
        }
        fixture.detectChanges();
        expect(status()).toBe("0 / 10");
        vi.advanceTimersByTime(1000);
        fixture.detectChanges();
        expect(status()).toBe("4 / 10");
        vi.useRealTimers();
    });

    test("shows the count alone", () => {
        const fixture = TestBed.createComponent(CharacterCounter);
        fixture.componentRef.setInput("count", 3);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".character-counter-text");
        expect(el.textContent).toBe("3");
        expect(el.parentElement.hasAttribute("data-remaining")).toBe(false);
    });

    test("counts against the limit", () => {
        const fixture = TestBed.createComponent(CharacterCounter);
        fixture.componentRef.setInput("count", 12);
        fixture.componentRef.setInput("max", 10);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".character-counter");
        expect(el.querySelector(".character-counter-text").textContent).toBe("12 / 10");
        expect(el.getAttribute("data-remaining")).toBe("-2");
        expect(el.getAttribute("data-over-limit")).toBe("true");
    });
});

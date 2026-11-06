import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { StatusLight } from "./StatusLight";

describe("StatusLight", () => {
    test("renders the <span> root with the base class", () => {
        const fixture = TestBed.createComponent(StatusLight);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.status-light");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(StatusLight);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.status-light");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=status, as in Svelte", () => {
        const fixture = TestBed.createComponent(StatusLight);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".status-light");
        expect(el.getAttribute("role")).toBe("status");
    });

    test("shows its label beside a hidden dot", () => {
        const fixture = TestBed.createComponent(StatusLight);
        fixture.componentRef.setInput("label", "Online");
        fixture.componentRef.setInput("variant", "positive");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".status-light");
        expect(el.getAttribute("data-variant")).toBe("positive");
        expect(el.querySelector(".status-light-dot").getAttribute("aria-hidden")).toBe("true");
        expect(el.querySelector(".status-light-label").textContent).toBe("Online");
    });
});

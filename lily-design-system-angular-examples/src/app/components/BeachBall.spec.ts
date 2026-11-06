import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { BeachBall } from "./BeachBall";

describe("BeachBall", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(BeachBall);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.beach-ball");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(BeachBall);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.beach-ball");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a busy status", () => {
        const fixture = TestBed.createComponent(BeachBall);
        fixture.componentRef.setInput("label", "Loading");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".beach-ball");
        expect(el.getAttribute("role")).toBe("status");
        expect(el.getAttribute("aria-live")).toBe("polite");
        expect(el.getAttribute("aria-busy")).toBe("true");
        expect(el.getAttribute("data-active")).toBe("true");
    });

    test("drops the spinner when idle", () => {
        const fixture = TestBed.createComponent(BeachBall);
        fixture.componentRef.setInput("active", false);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".beach-ball");
        expect(el.getAttribute("aria-busy")).toBe("false");
        expect(el.querySelector("span")).toBeNull();
    });
});

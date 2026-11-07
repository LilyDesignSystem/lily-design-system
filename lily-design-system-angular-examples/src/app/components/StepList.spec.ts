import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { StepList } from "./StepList";

describe("StepList", () => {
    test("renders the ol root with the base class", () => {
        const fixture = TestBed.createComponent(StepList);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("ol.step-list");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(StepList);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("ol.step-list");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("exposes the current step", () => {
        const fixture = TestBed.createComponent(StepList);
        fixture.componentRef.setInput("current", 2);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".step-list");
        expect(el.getAttribute("data-current")).toBe("2");
    });
});

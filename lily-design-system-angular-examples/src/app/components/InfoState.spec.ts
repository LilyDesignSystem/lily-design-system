import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { InfoState } from "./InfoState";

describe("InfoState", () => {
    test("renders the <section> root with the base class", () => {
        const fixture = TestBed.createComponent(InfoState);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("section.info-state");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(InfoState);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("section.info-state");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("renders its state", () => {
        const fixture = TestBed.createComponent(InfoState);
        fixture.componentRef.setInput("title", "No results");
        fixture.componentRef.setInput("description", "Try again");
        fixture.componentRef.setInput("level", "empty");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".info-state");
        expect(el.getAttribute("role")).toBe("status");
        expect(el.getAttribute("data-level")).toBe("empty");
        expect(el.getAttribute("aria-label")).toBe("No results");
        expect(el.querySelector(".info-state-title").textContent).toBe("No results");
        expect(el.querySelector(".info-state-description").textContent).toBe("Try again");
        expect(fixture.nativeElement.hasAttribute("title")).toBe(false);
    });
});

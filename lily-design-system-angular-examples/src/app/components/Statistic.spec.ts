import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Statistic } from "./Statistic";

describe("Statistic", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(Statistic);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.statistic");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Statistic);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.statistic");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=group, as in Svelte", () => {
        const fixture = TestBed.createComponent(Statistic);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".statistic");
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });

    test("names itself from its content", () => {
        const fixture = TestBed.createComponent(Statistic);
        fixture.componentRef.setInput("title", "Users");
        fixture.componentRef.setInput("value", "12");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".statistic");
        expect(el.getAttribute("aria-label")).toBe("Users: 12");
        expect(el.querySelector(".statistic-title").textContent).toBe("Users");
        expect(el.querySelector(".statistic-value").textContent).toBe("12");
        expect(fixture.nativeElement.hasAttribute("title")).toBe(false);
    });

    test("prefers its label", () => {
        const fixture = TestBed.createComponent(Statistic);
        fixture.componentRef.setInput("label", "Twelve users");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".statistic");
        expect(el.getAttribute("aria-label")).toBe("Twelve users");
    });
});

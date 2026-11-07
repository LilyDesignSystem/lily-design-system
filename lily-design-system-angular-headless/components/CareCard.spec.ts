import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CareCard } from "./CareCard";

describe("CareCard", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(CareCard);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.care-card");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(CareCard);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.care-card");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=region, as in Svelte", () => {
        const fixture = TestBed.createComponent(CareCard);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".care-card");
        expect(el.getAttribute("role")).toBe("region");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });

    test("names itself from its heading", () => {
        const fixture = TestBed.createComponent(CareCard);
        fixture.componentRef.setInput("heading", "Call 999");
        fixture.componentRef.setInput("type", "immediate");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".care-card");
        expect(el.getAttribute("aria-label")).toBe("Call 999");
        expect(el.getAttribute("data-type")).toBe("immediate");
        expect(el.querySelector("h2").textContent).toBe("Call 999");
    });
});

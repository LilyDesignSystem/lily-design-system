import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MedicalBannerBox } from "./MedicalBannerBox";

describe("MedicalBannerBox", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(MedicalBannerBox);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.medical-banner-box");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(MedicalBannerBox);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.medical-banner-box");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a named group when labelled", () => {
        const fixture = TestBed.createComponent(MedicalBannerBox);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".medical-banner-box");
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });

    test("has no role without a label", () => {
        const fixture = TestBed.createComponent(MedicalBannerBox);
        fixture.detectChanges();
        expect(
            fixture.nativeElement.querySelector(".medical-banner-box").hasAttribute("role"),
        ).toBe(false);
    });
});

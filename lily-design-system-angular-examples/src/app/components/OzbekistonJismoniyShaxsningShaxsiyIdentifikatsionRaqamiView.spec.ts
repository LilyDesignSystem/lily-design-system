import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView } from "./OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView";

describe("OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView", () => {
    test("renders the span root with the base class", () => {
        const fixture = TestBed.createComponent(
            OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView,
        );
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "span.ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(
            OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView,
        );
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "span.ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

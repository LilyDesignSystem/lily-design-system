import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GovernmentIdentifier } from "./GovernmentIdentifier";

describe("GovernmentIdentifier", () => {
    test("renders the <section> root with the base class", () => {
        const fixture = TestBed.createComponent(GovernmentIdentifier);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("section.government-identifier");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(GovernmentIdentifier);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("section.government-identifier");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

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

    test("renders its agency", () => {
        const fixture = TestBed.createComponent(GovernmentIdentifier);
        fixture.componentRef.setInput("agencyName", "Parks");
        fixture.componentRef.setInput("agencyHref", "/p");
        fixture.componentRef.setInput("logoUrl", "/l.png");
        fixture.componentRef.setInput("logoAlt", "Parks logo");
        fixture.componentRef.setInput("description", "An agency");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".government-identifier");
        expect(el.querySelector(".government-identifier-agency a").getAttribute("href")).toBe("/p");
        expect(el.querySelector(".government-identifier-logo").getAttribute("alt")).toBe("Parks logo");
        expect(el.querySelector(".government-identifier-description").textContent).toBe("An agency");
        expect(el.querySelector("nav").hidden).toBe(true);
    });
});

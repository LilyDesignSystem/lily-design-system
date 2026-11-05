import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TabPanel } from "./TabPanel";

describe("TabPanel", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(TabPanel);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.tab-panel");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(TabPanel);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.tab-panel");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a focusable tabpanel, hidden until selected", () => {
        const fixture = TestBed.createComponent(TabPanel);
        fixture.componentRef.setInput("label", "Details");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".tab-panel");
        expect(el.getAttribute("role")).toBe("tabpanel");
        expect(el.getAttribute("tabindex")).toBe("0");
        expect(el.getAttribute("aria-label")).toBe("Details");
        expect(el.hidden).toBe(true);
        fixture.componentRef.setInput("selected", true);
        fixture.detectChanges();
        expect(el.hidden).toBe(false);
    });

    test("labelledBy replaces label", () => {
        const fixture = TestBed.createComponent(TabPanel);
        fixture.componentRef.setInput("label", "Details");
        fixture.componentRef.setInput("labelledBy", "tab-1");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".tab-panel");
        expect(el.getAttribute("aria-labelledby")).toBe("tab-1");
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});

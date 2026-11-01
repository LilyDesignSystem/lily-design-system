import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GoToNextSection } from "./GoToNextSection";

describe("GoToNextSection", () => {
    function render(inputs: Record<string, unknown> = {}) {
        const fixture = TestBed.createComponent(GoToNextSection);
        for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
        fixture.detectChanges();
        return fixture;
    }

    test("appends the className input to the root class list", () => {
        const el = render({ className: "extra" }).nativeElement.querySelector(
            "a.go-to-next-section",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("links to href with the label as text and name", () => {
        const el = render({ href: "#results", label: "Next: Results" }).nativeElement.querySelector(
            "a.go-to-next-section",
        );
        expect(el.getAttribute("href")).toBe("#results");
        expect(el.textContent).toBe("Next: Results");
        expect(el.getAttribute("aria-label")).toBe("Next: Results");
    });
});

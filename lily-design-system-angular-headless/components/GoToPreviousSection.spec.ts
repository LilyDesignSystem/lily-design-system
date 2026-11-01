import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GoToPreviousSection } from "./GoToPreviousSection";

describe("GoToPreviousSection", () => {
    function render(inputs: Record<string, unknown> = {}) {
        const fixture = TestBed.createComponent(GoToPreviousSection);
        for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
        fixture.detectChanges();
        return fixture;
    }

    test("appends the className input to the root class list", () => {
        const el = render({ className: "extra" }).nativeElement.querySelector(
            "a.go-to-previous-section",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("links to href with the label as text and name", () => {
        const el = render({ href: "#summary", label: "Back: Summary" }).nativeElement.querySelector(
            "a.go-to-previous-section",
        );
        expect(el.getAttribute("href")).toBe("#summary");
        expect(el.textContent).toBe("Back: Summary");
        expect(el.getAttribute("aria-label")).toBe("Back: Summary");
    });
});

import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TourListItem } from "./TourListItem";

@Component({
    standalone: true,
    imports: [TourListItem],
    template: `<li
        lily-tour-list-item
        className="extra"
        label="Welcome"
        [current]="current"
        [stepNumber]="step"
        [totalSteps]="total"
        [stepTemplate]="template"
    >
        body
    </li>`,
})
class TestHost {
    current = true;
    step: number | null = null;
    total: number | null = null;
    template = "";
}

function make(values: Partial<TestHost> = {}) {
    const fixture = TestBed.createComponent(TestHost);
    Object.assign(fixture.componentInstance, values);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector("li");
}

describe("TourListItem", () => {
    test("the host is the li itself: a named step", () => {
        const li = make();
        expect(li.classList.contains("tour-list-item")).toBe(true);
        expect(li.classList.contains("extra")).toBe(true);
        expect(li.getAttribute("role")).toBe("group");
        expect(li.getAttribute("aria-roledescription")).toBe("step");
        expect(li.getAttribute("aria-label")).toBe("Welcome");
    });

    test("the current step shows", () => {
        const li = make();
        expect(li.hasAttribute("data-current")).toBe(true);
        expect(li.hidden).toBe(false);
        expect(li.hasAttribute("aria-hidden")).toBe(false);
    });

    test("other steps are hidden", () => {
        const li = make({ current: false });
        expect(li.hasAttribute("data-current")).toBe(false);
        expect(li.hidden).toBe(true);
        expect(li.getAttribute("aria-hidden")).toBe("true");
    });

    test("the numbers name it only through the consumer's template", () => {
        expect(make({ step: 2, total: 5 }).getAttribute("aria-label")).toBe("Welcome");
        expect(
            make({ step: 2, total: 5, template: "{label}: {step}/{total}" }).getAttribute(
                "aria-label",
            ),
        ).toBe("Welcome: 2/5");
    });
});

import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TimelineList } from "./TimelineList";

describe("TimelineList", () => {
    test("renders the ol root with the base class", () => {
        const fixture = TestBed.createComponent(TimelineList);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("ol.timeline-list");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(TimelineList);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("ol.timeline-list");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("coverageLabel says what the list is a view of, as its first item", () => {
        const fixture = TestBed.createComponent(TimelineList);
        fixture.componentRef.setInput("label", "History");
        fixture.componentRef.setInput(
            "coverageLabel",
            "Last 12 months, newest first. The GP record did not answer.",
        );
        fixture.detectChanges();
        const first = (fixture.nativeElement as HTMLElement).querySelector(
            ".timeline-list",
        )!.firstElementChild!;
        expect(first.tagName).toBe("LI");
        expect(first.className).toBe("timeline-list-coverage");
        expect(first.textContent).toBe(
            "Last 12 months, newest first. The GP record did not answer.",
        );
    });
});

import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Details } from "./Details";

describe("Details", () => {
    function render(inputs: Record<string, unknown> = {}) {
        const fixture = TestBed.createComponent(Details);
        for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
        fixture.detectChanges();
        return fixture;
    }

    test("appends the className input to the root class list", () => {
        const el = render({ className: "extra" }).nativeElement.querySelector("details.details");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("renders a <details> whose first child is the summary text", () => {
        const el = render({ summary: "More" }).nativeElement.querySelector("details.details");
        expect(el.firstElementChild.tagName).toBe("SUMMARY");
        expect(el.firstElementChild.textContent).toBe("More");
        expect(el.open).toBe(false);
    });

    test("open opens it, and a toggle writes back to the open model", () => {
        expect(render({ open: true }).nativeElement.querySelector("details.details").open).toBe(
            true,
        );
        const fixture = render();
        const el = fixture.nativeElement.querySelector("details.details");
        el.open = true;
        el.dispatchEvent(new Event("toggle"));
        expect(fixture.componentInstance.open()).toBe(true);
    });
});

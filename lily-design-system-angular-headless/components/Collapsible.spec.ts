import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Collapsible } from "./Collapsible";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Collapsible);
    for (const [key, value] of Object.entries({ summary: "More", ...inputs }))
        fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

describe("Collapsible", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector("details.collapsible");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("the summary is the toggle", () => {
        expect(make().nativeElement.querySelector("details > summary").textContent.trim()).toBe(
            "More",
        );
    });

    test("open renders the attribute", () => {
        expect(make().nativeElement.querySelector("details").open).toBe(false);
        expect(make({ open: true }).nativeElement.querySelector("details").open).toBe(true);
    });

    test("a toggle in the browser reaches the model", () => {
        const fixture = make();
        const seen: boolean[] = [];
        fixture.componentInstance.open.subscribe((value: boolean) => seen.push(value));
        const details = fixture.nativeElement.querySelector("details");
        details.open = true;
        details.dispatchEvent(new Event("toggle"));
        expect(fixture.componentInstance.open()).toBe(true);
        expect(seen).toEqual([true]);
    });
});

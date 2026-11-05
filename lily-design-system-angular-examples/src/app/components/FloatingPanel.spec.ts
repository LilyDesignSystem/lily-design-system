import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FloatingPanel } from "./FloatingPanel";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(FloatingPanel);
    fixture.componentRef.setInput("label", "Filters");
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return { fixture, root: fixture.nativeElement.querySelector("div.floating-panel") as HTMLElement };
}

describe("FloatingPanel", () => {
    test("renders the div root with the base class", () => {
        expect(make().root).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        expect(make({ className: "extra" }).root.classList.contains("extra")).toBe(true);
    });

    test("is a labelled region", () => {
        const { root } = make();
        expect(root.getAttribute("role")).toBe("region");
        expect(root.getAttribute("aria-label")).toBe("Filters");
    });

    test("is hidden until open, and hides again", async () => {
        const { fixture, root } = make();
        await fixture.whenStable();
        expect(root.hidden).toBe(true);
        fixture.componentRef.setInput("open", true);
        await fixture.whenStable();
        expect(root.hidden).toBe(false);
        fixture.componentRef.setInput("open", false);
        await fixture.whenStable();
        expect(root.hidden).toBe(true);
    });
});

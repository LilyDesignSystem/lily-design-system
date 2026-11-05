import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Tooltip } from "./Tooltip";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Tooltip);
    for (const [key, value] of Object.entries({ label: "Help", ...inputs }))
        fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

describe("Tooltip", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector("div.tooltip");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a manual popover, hidden until visible", async () => {
        const fixture = make();
        const root = fixture.nativeElement.querySelector("div");
        expect(root.getAttribute("role")).toBe("tooltip");
        expect(root.hidden).toBe(true);
        fixture.componentRef.setInput("visible", true);
        await fixture.whenStable();
        expect(root.hidden).toBe(false);
    });

    test("label is the text and id links it", () => {
        const root = make({ id: "tip" }).nativeElement.querySelector("div");
        expect(root.textContent).toBe("Help");
        expect(root.id).toBe("tip");
        expect(root.hasAttribute("aria-label")).toBe(false);
    });
});

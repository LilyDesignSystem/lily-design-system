import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { HoverCard } from "./HoverCard";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(HoverCard);
    for (const [key, value] of Object.entries({ label: "Card", ...inputs })) fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

describe("HoverCard", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector("div.hover-card");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a manual popover, hidden until open", async () => {
        const fixture = make();
        const root = fixture.nativeElement.querySelector("div");
        expect(root.getAttribute("role")).toBe("tooltip");
        expect(root.hidden).toBe(true);
        fixture.componentRef.setInput("open", true);
        await fixture.whenStable();
        expect(root.hidden).toBe(false);
    });

    test("label names it", () => {
        expect(make().nativeElement.querySelector("div").getAttribute("aria-label")).toBe("Card");
    });
});

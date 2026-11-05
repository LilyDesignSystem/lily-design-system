import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { StickyPromoBanner } from "./StickyPromoBanner";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(StickyPromoBanner);
    for (const [key, value] of Object.entries({ label: "Offer", dismissLabel: "Dismiss", ...inputs })) fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

describe("StickyPromoBanner", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector("aside.sticky-promo-banner");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("open and position drive the root", () => {
        let root = make().nativeElement.querySelector("aside");
        expect(root.hidden).toBe(false);
        expect(root.getAttribute("data-position")).toBe("bottom");
        expect(root.getAttribute("style")).toContain("bottom: 0");
        root = make({ open: false, position: "top" }).nativeElement.querySelector("aside");
        expect(root.hidden).toBe(true);
        expect(root.getAttribute("data-position")).toBe("top");
        expect(root.getAttribute("style")).toContain("top: 0");
    });

    test("the button reports", () => {
        const fixture = make();
        let dismissed = 0;
        fixture.componentInstance.dismissed.subscribe(() => dismissed++);
        const button = fixture.nativeElement.querySelector("button.sticky-promo-banner-dismiss");
        expect(button.getAttribute("aria-label")).toBe("Dismiss");
        button.click();
        expect(dismissed).toBe(1);
    });
});

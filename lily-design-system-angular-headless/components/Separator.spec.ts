import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Separator } from "./Separator";

describe("Separator", () => {
    function render(inputs: Record<string, unknown> = {}) {
        const fixture = TestBed.createComponent(Separator);
        for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
        fixture.detectChanges();
        return fixture;
    }

    test("appends the className input to the root class list", () => {
        const el = render({ className: "extra" }).nativeElement.querySelector("hr.separator");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("renders an <hr> with role separator and an optional label", () => {
        const el = render({ label: "Section break" }).nativeElement.querySelector("hr.separator");
        expect(el.getAttribute("role")).toBe("separator");
        expect(el.getAttribute("aria-label")).toBe("Section break");
        expect(
            render().nativeElement.querySelector("hr.separator").hasAttribute("aria-label"),
        ).toBe(false);
    });
});

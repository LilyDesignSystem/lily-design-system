import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Label } from "./Label";

describe("Label", () => {
    function render(inputs: Record<string, unknown> = {}) {
        const fixture = TestBed.createComponent(Label);
        for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
        fixture.detectChanges();
        return fixture;
    }

    test("appends the className input to the root class list", () => {
        const el = render({ className: "extra" }).nativeElement.querySelector("label.label");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("for names the control", () => {
        expect(
            render({ for: "email" }).nativeElement.querySelector("label.label").getAttribute("for"),
        ).toBe("email");
        expect(render().nativeElement.querySelector("label.label").hasAttribute("for")).toBe(false);
    });
});

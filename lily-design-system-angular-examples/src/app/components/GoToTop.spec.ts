import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { GoToTop } from "./GoToTop";

describe("GoToTop", () => {
    function render(inputs: Record<string, unknown> = {}) {
        const fixture = TestBed.createComponent(GoToTop);
        for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
        fixture.detectChanges();
        return fixture;
    }

    test("appends the className input to the root class list", () => {
        const el = render({ className: "extra" }).nativeElement.querySelector("a.go-to-top");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("links to #top by default, or to href", () => {
        expect(render().nativeElement.querySelector("a.go-to-top").getAttribute("href")).toBe(
            "#top",
        );
        expect(
            render({ href: "#start" })
                .nativeElement.querySelector("a.go-to-top")
                .getAttribute("href"),
        ).toBe("#start");
    });
});

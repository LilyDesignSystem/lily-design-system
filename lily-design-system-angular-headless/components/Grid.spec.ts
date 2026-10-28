import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Grid } from "./Grid";

describe("Grid", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(Grid);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.grid");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Grid);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.grid");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    const style = (setup: (f: any) => void) => {
        const fixture = TestBed.createComponent(Grid);
        setup(fixture);
        fixture.detectChanges();
        return fixture.nativeElement.querySelector("div.grid").getAttribute("style") as string;
    };

    test("defaults to 12 equal columns", () => {
        expect(style(() => {})).toContain("repeat(12, minmax(0, 1fr))");
    });

    test("minColumnWidth generates a fluid auto-fit template", () => {
        const s = style((f) => f.componentRef.setInput("minColumnWidth", "12rem"));
        expect(s).toContain("repeat(auto-fit, minmax(min(12rem, 100%), 1fr))");
    });

    test("minColumnWidth wins over columns", () => {
        const s = style((f) => {
            f.componentRef.setInput("columns", 3);
            f.componentRef.setInput("minColumnWidth", "120px");
        });
        expect(s).toContain("min(120px, 100%)");
        expect(s).not.toContain("repeat(3,");
    });
});

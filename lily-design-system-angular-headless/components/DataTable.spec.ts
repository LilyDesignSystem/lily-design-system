import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DataTable } from "./DataTable";

describe("DataTable", () => {
    test("renders the table root with the base class", () => {
        const fixture = TestBed.createComponent(DataTable);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("table.data-table");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(DataTable);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("table.data-table");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("names the root with aria-label from the label input", () => {
        const fixture = TestBed.createComponent(DataTable);
        fixture.componentRef.setInput("label", "Named");
        fixture.detectChanges();
        expect(
            fixture.nativeElement.querySelector("table.data-table").getAttribute("aria-label"),
        ).toBe("Named");
    });

    test("is a grid with a caption", () => {
        const fixture = TestBed.createComponent(DataTable);
        fixture.componentRef.setInput("caption", "Rota");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("table");
        expect(el.getAttribute("role")).toBe("grid");
        expect(el.querySelector("caption").textContent).toBe("Rota");
    });

    test("has no caption by default", () => {
        const fixture = TestBed.createComponent(DataTable);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("table");
        expect(el.querySelector("caption")).toBeNull();
    });
});

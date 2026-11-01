import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Sidebar } from "./Sidebar";

describe("Sidebar", () => {
    test("renders the <aside> root with the base class", () => {
        const fixture = TestBed.createComponent(Sidebar);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("aside.sidebar");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Sidebar);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("aside.sidebar");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

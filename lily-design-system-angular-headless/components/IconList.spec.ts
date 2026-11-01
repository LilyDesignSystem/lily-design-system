import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { IconList } from "./IconList";

describe("IconList", () => {
    test("renders the <ul> root with the base class", () => {
        const fixture = TestBed.createComponent(IconList);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("ul.icon-list");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(IconList);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("ul.icon-list");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

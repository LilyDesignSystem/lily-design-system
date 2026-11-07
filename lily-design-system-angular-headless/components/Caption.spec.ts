import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Caption } from "./Caption";

describe("Caption", () => {
    test("renders the figcaption root with the base class", () => {
        const fixture = TestBed.createComponent(Caption);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("figcaption.caption");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Caption);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("figcaption.caption");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

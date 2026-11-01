import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Place } from "./Place";

describe("Place", () => {
    test("renders the <article> root with the base class", () => {
        const fixture = TestBed.createComponent(Place);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("article.place");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Place);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("article.place");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

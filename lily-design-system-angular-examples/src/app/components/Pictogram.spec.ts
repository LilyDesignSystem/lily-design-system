import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Pictogram } from "./Pictogram";

describe("Pictogram", () => {
    test("renders the <figure> root with the base class", () => {
        const fixture = TestBed.createComponent(Pictogram);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("figure.pictogram");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Pictogram);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("figure.pictogram");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("renders its caption", () => {
        const fixture = TestBed.createComponent(Pictogram);
        fixture.componentRef.setInput("layout", "side");
        fixture.componentRef.setInput("heading", "Safe");
        fixture.componentRef.setInput("description", "Very");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".pictogram");
        expect(el.getAttribute("data-layout")).toBe("side");
        expect(el.querySelector(".pictogram-heading").textContent).toBe("Safe");
        expect(el.querySelector(".pictogram-description").textContent).toBe("Very");
        expect(el.querySelector(".pictogram-icon").getAttribute("aria-hidden")).toBe("true");
    });
});

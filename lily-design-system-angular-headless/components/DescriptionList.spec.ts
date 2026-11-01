import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DescriptionList } from "./DescriptionList";

describe("DescriptionList", () => {
    test("renders the <dl> root with the base class", () => {
        const fixture = TestBed.createComponent(DescriptionList);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("dl.description-list");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(DescriptionList);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("dl.description-list");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

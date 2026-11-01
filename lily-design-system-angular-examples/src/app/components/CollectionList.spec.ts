import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CollectionList } from "./CollectionList";

describe("CollectionList", () => {
    test("renders the <ul> root with the base class", () => {
        const fixture = TestBed.createComponent(CollectionList);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("ul.collection-list");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(CollectionList);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("ul.collection-list");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Person } from "./Person";

describe("Person", () => {
    test("renders the <article> root with the base class", () => {
        const fixture = TestBed.createComponent(Person);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("article.person");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Person);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("article.person");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

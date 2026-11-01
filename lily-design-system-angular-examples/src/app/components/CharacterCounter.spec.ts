import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { CharacterCounter } from "./CharacterCounter";

describe("CharacterCounter", () => {
    test("renders the <span> root with the base class", () => {
        const fixture = TestBed.createComponent(CharacterCounter);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.character-counter");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(CharacterCounter);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.character-counter");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

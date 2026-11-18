import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AlImaratRaqmAlHuwiyahView } from "./AlImaratRaqmAlHuwiyahView";

describe("AlImaratRaqmAlHuwiyahView", () => {
    test("renders the span root with the base class", () => {
        const fixture = TestBed.createComponent(AlImaratRaqmAlHuwiyahView);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.al-imarat-raqm-al-huwiyah-view");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(AlImaratRaqmAlHuwiyahView);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.al-imarat-raqm-al-huwiyah-view");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

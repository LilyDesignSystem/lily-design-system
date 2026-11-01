import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AsSaudiyahRaqmAlHuwiyahAlWataniyahView } from "./AsSaudiyahRaqmAlHuwiyahAlWataniyahView";

describe("AsSaudiyahRaqmAlHuwiyahAlWataniyahView", () => {
    test("renders the span root with the base class", () => {
        const fixture = TestBed.createComponent(AsSaudiyahRaqmAlHuwiyahAlWataniyahView);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "span.as-saudiyah-raqm-al-huwiyah-al-wataniyah-view",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(AsSaudiyahRaqmAlHuwiyahAlWataniyahView);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "span.as-saudiyah-raqm-al-huwiyah-al-wataniyah-view",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

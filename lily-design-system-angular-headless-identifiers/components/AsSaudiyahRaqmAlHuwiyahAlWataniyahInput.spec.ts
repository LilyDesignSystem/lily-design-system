import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AsSaudiyahRaqmAlHuwiyahAlWataniyahInput } from "./AsSaudiyahRaqmAlHuwiyahAlWataniyahInput";

describe("AsSaudiyahRaqmAlHuwiyahAlWataniyahInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(AsSaudiyahRaqmAlHuwiyahAlWataniyahInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.as-saudiyah-raqm-al-huwiyah-al-wataniyah-input",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(AsSaudiyahRaqmAlHuwiyahAlWataniyahInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.as-saudiyah-raqm-al-huwiyah-al-wataniyah-input",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

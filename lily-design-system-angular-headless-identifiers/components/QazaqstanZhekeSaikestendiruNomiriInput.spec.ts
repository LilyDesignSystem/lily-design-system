import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { QazaqstanZhekeSaikestendiruNomiriInput } from "./QazaqstanZhekeSaikestendiruNomiriInput";

describe("QazaqstanZhekeSaikestendiruNomiriInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(QazaqstanZhekeSaikestendiruNomiriInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.qazaqstan-zheke-saikestendiru-nomiri-input",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(QazaqstanZhekeSaikestendiruNomiriInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.qazaqstan-zheke-saikestendiru-nomiri-input",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

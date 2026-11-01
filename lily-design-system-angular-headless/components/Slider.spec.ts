import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Slider } from "./Slider";

describe("Slider", () => {
    function render(inputs: Record<string, unknown> = {}) {
        const fixture = TestBed.createComponent(Slider);
        for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
        fixture.detectChanges();
        return fixture;
    }

    test("appends the className input to the root class list", () => {
        const el = render({ className: "extra" }).nativeElement.querySelector("input.slider");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("renders a range input with value, min, max, step and label", () => {
        const el = render({
            label: "Volume",
            value: 30,
            min: 10,
            max: 50,
            step: 5,
        }).nativeElement.querySelector("input.slider");
        expect(el.type).toBe("range");
        expect(el.getAttribute("aria-label")).toBe("Volume");
        expect(el.min).toBe("10");
        expect(el.max).toBe("50");
        expect(el.step).toBe("5");
        expect(el.value).toBe("30");
    });

    test("writes the input's value back to the value model", () => {
        const fixture = render();
        const el = fixture.nativeElement.querySelector("input.slider");
        el.value = "40";
        el.dispatchEvent(new Event("input"));
        expect(fixture.componentInstance.value()).toBe(40);
    });

    test("disabled disables the input", () => {
        expect(
            render({ disabled: true }).nativeElement.querySelector("input.slider").disabled,
        ).toBe(true);
    });
});

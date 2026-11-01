import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SliderButton } from "./SliderButton";

describe("SliderButton", () => {
    test("renders the button root with the base class", () => {
        const fixture = TestBed.createComponent(SliderButton);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("button.slider-button");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(SliderButton);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("button.slider-button");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

describe("SliderButton keyboard", () => {
    function setup(inputs: Record<string, unknown> = {}) {
        const fixture = TestBed.createComponent(SliderButton);
        fixture.componentRef.setInput("label", "Confirm order");
        for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
        let confirms = 0;
        fixture.componentInstance.confirm.subscribe(() => (confirms += 1));
        fixture.detectChanges();
        const button: HTMLButtonElement =
            fixture.nativeElement.querySelector("button.slider-button");
        const press = (key: string) => {
            const event = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true });
            button.dispatchEvent(event);
            fixture.detectChanges();
            return event.defaultPrevented;
        };
        return {
            button,
            press,
            confirms: () => confirms,
            now: () => button.getAttribute("aria-valuenow"),
        };
    }

    test("is a labelled button with role slider at 0 of 100", () => {
        const { button } = setup();
        expect(button.getAttribute("role")).toBe("slider");
        expect(button.getAttribute("aria-label")).toBe("Confirm order");
        expect(
            ["aria-valuenow", "aria-valuemin", "aria-valuemax"].map((a) => button.getAttribute(a)),
        ).toEqual(["0", "0", "100"]);
    });

    test("ArrowRight and ArrowLeft move by step; Home returns to 0", () => {
        const { press, now } = setup({ step: 25 });
        press("ArrowRight");
        press("ArrowRight");
        expect(now()).toBe("50");
        press("ArrowLeft");
        expect(now()).toBe("25");
        press("Home");
        expect(now()).toBe("0");
        press("ArrowLeft");
        expect(now()).toBe("0");
    });

    test("reaching 100 emits confirm once and resets", () => {
        const { press, now, confirms } = setup({ step: 50 });
        press("ArrowRight");
        expect(confirms()).toBe(0);
        press("ArrowRight");
        expect(confirms()).toBe(1);
        expect(now()).toBe("0");
    });

    test("End, Enter and Space confirm at once; the keys are cancelled and Tab is not", () => {
        const { press, confirms } = setup();
        expect(["End", "Enter", " ", "Tab"].map(press)).toEqual([true, true, true, false]);
        expect(confirms()).toBe(3);
    });

    test("disabled ignores the keys", () => {
        const { button, press, now, confirms } = setup({ disabled: true });
        expect(button.disabled).toBe(true);
        press("End");
        press("ArrowRight");
        expect(confirms()).toBe(0);
        expect(now()).toBe("0");
    });
});

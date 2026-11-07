import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { NetPromoterScorePicker } from "./NetPromoterScorePicker";

function make(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(NetPromoterScorePicker);
    for (const [key, value] of Object.entries({ label: "Score", ...inputs }))
        fixture.componentRef.setInput(key, value);
    fixture.detectChanges();
    return fixture;
}

describe("NetPromoterScorePicker", () => {
    test("renders the root with the base class and the className input", () => {
        const el = make({ className: "extra" }).nativeElement.querySelector(
            "fieldset.net-promoter-score-picker",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a named radiogroup of eleven radios, 0 to 10", () => {
        const root = make().nativeElement;
        expect(root.querySelector("fieldset").getAttribute("role")).toBe("radiogroup");
        expect(root.querySelector("fieldset").getAttribute("aria-label")).toBe("Score");
        const radios = [...root.querySelectorAll("input[type=radio]")] as HTMLInputElement[];
        expect(radios.map((radio) => radio.value)).toEqual([
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
        ]);
        expect(radios.every((radio) => radio.name === "nps")).toBe(true);
        expect(radios[3].getAttribute("aria-label")).toBe("3");
    });

    test("value checks a radio, and name is passed on", () => {
        const radios = make({ value: "7", name: "service" }).nativeElement.querySelectorAll(
            "input",
        );
        expect(radios[7].checked).toBe(true);
        expect(radios[6].checked).toBe(false);
        expect(radios[0].name).toBe("service");
    });

    test("choosing updates the value", () => {
        const fixture = make();
        fixture.nativeElement.querySelectorAll("input")[9].click();
        expect(fixture.componentInstance.value()).toBe("9");
    });
});

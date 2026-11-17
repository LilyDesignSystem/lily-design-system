import { TestBed } from "@angular/core/testing";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import { QuantityInputDiv } from "./QuantityInputDiv";

const units = [
    { value: "kg", label: "kilograms", min: 0, max: 300, step: 0.1 },
    { value: "[lb_av]", label: "pounds", min: 0, max: 660, step: 0.1 },
];

function make(inputs: Record<string, unknown>) {
    const fixture = TestBed.createComponent(QuantityInputDiv);
    for (const [k, v] of Object.entries({
        label: "Weight",
        magnitudeLabel: "Amount",
        unitLabel: "Unit",
        units,
        ...inputs,
    }))
        fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return fixture;
}

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("QuantityInputDiv", () => {
    test("renders a named group with a labelled number and a labelled unit select", () => {
        const root: HTMLElement = make({}).nativeElement;
        const group = root.querySelector("div.quantity-input-div")!;
        expect(group.getAttribute("role")).toBe("group");
        expect(group.getAttribute("aria-label")).toBe("Weight");
        expect((root.querySelector(".quantity-input-div-magnitude") as HTMLInputElement).type).toBe(
            "number",
        );
        expect((root.querySelector("select") as HTMLSelectElement).value).toBe("kg");
    });

    test("the number takes the limits of the unit chosen, and keeps its value", () => {
        const fixture = make({});
        const root: HTMLElement = fixture.nativeElement;
        const number = root.querySelector(".quantity-input-div-magnitude") as HTMLInputElement;
        number.value = "70";
        number.dispatchEvent(new Event("input"));
        expect(number.getAttribute("max")).toBe("300");
        const select = root.querySelector("select") as HTMLSelectElement;
        select.value = "[lb_av]";
        select.dispatchEvent(new Event("change"));
        fixture.detectChanges();
        expect(number.getAttribute("max")).toBe("660");
        expect(fixture.componentInstance.magnitude()).toBe("70");
        expect(fixture.componentInstance.unit()).toBe("[lb_av]");
    });

    test("one unit is text, linked to the number, and submitted with it", () => {
        const root: HTMLElement = make({ units: [units[0]], name: "weight" }).nativeElement;
        expect(root.querySelector("select")).toBeNull();
        const unit = root.querySelector(".quantity-input-div-unit") as HTMLElement;
        expect(
            root.querySelector(".quantity-input-div-magnitude")!.getAttribute("aria-describedby"),
        ).toBe(unit.id);
        expect(root.querySelector('input[type="hidden"]')!.getAttribute("name")).toBe(
            "weight-unit",
        );
    });
});

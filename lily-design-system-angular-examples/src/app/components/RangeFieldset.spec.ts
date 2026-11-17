import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { RangeFieldset } from "./RangeFieldset";

const base = { legend: "Price", minimumLabel: "Lowest price", maximumLabel: "Highest price" };

function render(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(RangeFieldset);
    for (const [k, v] of Object.entries({ ...base, ...inputs }))
        fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    return {
        fixture,
        root,
        lower: root.querySelector(".range-fieldset-minimum") as HTMLInputElement,
        upper: root.querySelector(".range-fieldset-maximum") as HTMLInputElement,
    };
}

function move(input: HTMLInputElement, value: string) {
    input.value = value;
    input.dispatchEvent(new Event("input"));
}

describe("RangeFieldset", () => {
    test("is a fieldset with a legend and two range inputs on one scale", () => {
        const { root, lower, upper } = render({ min: 10, max: 90, step: 5, className: "extra" });
        const fieldset = root.querySelector("fieldset.range-fieldset")!;
        expect(fieldset.classList.contains("extra")).toBe(true);
        expect(fieldset.querySelector("legend.range-fieldset-legend")?.textContent).toBe("Price");
        expect(lower.getAttribute("aria-label")).toBe("Lowest price");
        expect(upper.getAttribute("aria-label")).toBe("Highest price");
        for (const input of [lower, upper]) {
            expect(input.type).toBe("range");
            expect(input.min).toBe("10");
            expect(input.max).toBe("90");
            expect(input.step).toBe("5");
        }
        expect(lower.value).toBe("10");
        expect(upper.value).toBe("90");
    });

    test("the lower thumb stops at the upper one", () => {
        const { fixture, lower } = render({ minimum: 20, maximum: 60 });
        const changes: [number, number][] = [];
        fixture.componentInstance.change.subscribe((value) => changes.push(value));
        move(lower, "80");
        expect(lower.value).toBe("60");
        expect(fixture.componentInstance.minimum()).toBe(60);
        expect(changes.at(-1)).toEqual([60, 60]);
    });

    test("the upper thumb stops at the lower one", () => {
        const { fixture, upper } = render({ minimum: 20, maximum: 60 });
        move(upper, "5");
        expect(upper.value).toBe("20");
        expect(fixture.componentInstance.maximum()).toBe(20);
    });

    test("both values submit as their own form fields", () => {
        const { root } = render({
            minimum: 25,
            maximum: 75,
            minimumName: "price-min",
            maximumName: "price-max",
        });
        const form = document.createElement("form");
        form.append(root.querySelector("fieldset")!);
        const data = new FormData(form);
        expect(data.get("price-min")).toBe("25");
        expect(data.get("price-max")).toBe("75");
    });

    test("a form reset puts both thumbs back", () => {
        const { root, lower, upper } = render({ minimum: 25, maximum: 75 });
        const form = document.createElement("form");
        form.append(root.querySelector("fieldset")!);
        move(lower, "40");
        move(upper, "50");
        form.reset();
        expect(lower.value).toBe("25");
        expect(upper.value).toBe("75");
    });

    test("disabled disables both thumbs", () => {
        const { root } = render({ disabled: true });
        expect((root.querySelector("fieldset") as HTMLFieldSetElement).disabled).toBe(true);
    });
});

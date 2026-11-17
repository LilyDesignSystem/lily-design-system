import { afterEach, describe, expect, test } from "vitest";

import { QuantityInputDiv } from "./quantity-input-div.js";

if (!customElements.get("lily-quantity-input-div"))
    customElements.define("lily-quantity-input-div", QuantityInputDiv);

afterEach(() => {
    document.body.innerHTML = "";
});

const UNITS = JSON.stringify([
    { value: "kg", label: "kilograms", min: 0, max: 300, step: 0.1 },
    { value: "[lb_av]", label: "pounds", min: 0, max: 660, step: 0.1 },
]);

describe("QuantityInputDiv", () => {
    test("renders a named group; the number takes the limits of the unit chosen and keeps its value", () => {
        document.body.innerHTML = `<lily-quantity-input-div label="Weight" magnitude-label="Amount" unit-label="Unit" units='${UNITS}'></lily-quantity-input-div>`;
        const host = document.querySelector("lily-quantity-input-div") as QuantityInputDiv;
        const group = host.querySelector("div.quantity-input-div")!;
        expect(group.getAttribute("role")).toBe("group");
        expect(group.getAttribute("aria-label")).toBe("Weight");
        const number = host.querySelector(".quantity-input-div-magnitude") as HTMLInputElement;
        number.value = "70";
        expect(number.getAttribute("max")).toBe("300");
        const select = host.querySelector("select") as HTMLSelectElement;
        select.value = "[lb_av]";
        select.dispatchEvent(new Event("change"));
        expect(number.getAttribute("max")).toBe("660");
        expect(host.magnitude).toBe("70");
        expect(host.unit).toBe("[lb_av]");
    });

    test("one unit is text, linked to the number, and submitted with it", () => {
        const one = JSON.stringify([{ value: "kg", label: "kilograms" }]);
        document.body.innerHTML = `<lily-quantity-input-div label="Weight" magnitude-label="Amount" units='${one}' name="weight"></lily-quantity-input-div>`;
        expect(document.querySelector("select")).toBeNull();
        const unit = document.querySelector(".quantity-input-div-unit") as HTMLElement;
        expect(unit.tagName).toBe("SPAN");
        expect(
            document
                .querySelector(".quantity-input-div-magnitude")!
                .getAttribute("aria-describedby"),
        ).toBe(unit.id);
        expect((document.querySelector('input[type="hidden"]') as HTMLInputElement).name).toBe(
            "weight-unit",
        );
    });
});

import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

const units = [
    { value: "kg", label: "kilograms", min: 0, max: 300, step: 0.1 },
    { value: "[lb_av]", label: "pounds", min: 0, max: 660, step: 0.1 },
];

describe("quantity-input-div", () => {
    it("renders a named group with the starting unit's limits on the number", () => {
        const { document } = render("quantity-input-div", {
            label: "Weight",
            magnitudeLabel: "Amount",
            unitLabel: "Unit",
            units,
            unit: "[lb_av]",
            name: "weight",
        });
        const group = document.querySelector("div.quantity-input-div");
        expect(group.getAttribute("role")).toBe("group");
        expect(group.getAttribute("aria-label")).toBe("Weight");
        const number = document.querySelector(".quantity-input-div-magnitude");
        expect(number.getAttribute("max")).toBe("660");
        expect(number.getAttribute("name")).toBe("weight-magnitude");
        expect(document.querySelector("select").getAttribute("name")).toBe("weight-unit");
        expect(document.querySelector('option[value="[lb_av]"]').hasAttribute("selected")).toBe(
            true,
        );
        expect(document.querySelector('option[value="kg"]').getAttribute("data-max")).toBe("300");
    });

    it("one unit is text, linked to the number, and submitted with it", () => {
        const { document } = render("quantity-input-div", {
            label: "Weight",
            magnitudeLabel: "Amount",
            units: [units[0]],
            name: "weight",
        });
        expect(document.querySelector("select")).toBeNull();
        const unit = document.querySelector(".quantity-input-div-unit");
        expect(
            document
                .querySelector(".quantity-input-div-magnitude")
                .getAttribute("aria-describedby"),
        ).toBe(unit.id);
        expect(document.querySelector('input[type="hidden"]').getAttribute("name")).toBe(
            "weight-unit",
        );
    });
});

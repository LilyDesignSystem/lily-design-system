import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const base = { legend: "Price", minimumLabel: "Lowest price", maximumLabel: "Highest price" };

describe("rangeFieldset", () => {
    it("renders a fieldset with a legend and two range inputs on one scale", () => {
        const { document } = render("range-fieldset", { ...base, min: 10, max: 90, step: 5 });
        const root = document.querySelector("fieldset.range-fieldset");
        expect(root).toBeTruthy();
        expect(root.querySelector("legend.range-fieldset-legend").textContent).toBe("Price");
        const lower = root.querySelector("input.range-fieldset-minimum");
        const upper = root.querySelector("input.range-fieldset-maximum");
        expect(lower.getAttribute("aria-label")).toBe("Lowest price");
        expect(upper.getAttribute("aria-label")).toBe("Highest price");
        for (const input of [lower, upper]) {
            expect(input.getAttribute("type")).toBe("range");
            expect(input.getAttribute("min")).toBe("10");
            expect(input.getAttribute("max")).toBe("90");
            expect(input.getAttribute("step")).toBe("5");
        }
        expect(lower.getAttribute("value")).toBe("10");
        expect(upper.getAttribute("value")).toBe("90");
    });

    it("both values submit as their own form fields, and a form reset puts both back", () => {
        const { document } = render("range-fieldset", {
            ...base,
            minimum: 25,
            maximum: 75,
            minimumName: "price-min",
            maximumName: "price-max",
        });
        const form = document.createElement("form");
        form.append(document.querySelector("fieldset"));
        const data = new document.defaultView.FormData(form);
        expect(data.get("price-min")).toBe("25");
        expect(data.get("price-max")).toBe("75");
        const lower = form.querySelector(".range-fieldset-minimum");
        lower.value = "40";
        form.reset();
        expect(lower.value).toBe("25");
    });

    it("emits disabled, id, classes and attributes only when given", () => {
        const plain = render("range-fieldset", base).document.querySelector("fieldset");
        expect(plain.hasAttribute("disabled")).toBe(false);
        expect(plain.hasAttribute("id")).toBe(false);
        const { document } = render("range-fieldset", {
            ...base,
            disabled: true,
            id: "r",
            classes: "x",
            attributes: { "data-k": "v" },
        });
        const root = document.querySelector("fieldset.range-fieldset.x");
        expect(root.hasAttribute("disabled")).toBe(true);
        expect(root.id).toBe("r");
        expect(root.getAttribute("data-k")).toBe("v");
    });
});

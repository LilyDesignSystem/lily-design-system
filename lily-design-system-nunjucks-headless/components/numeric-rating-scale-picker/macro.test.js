import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("numeric-rating-scale-picker", () => {
    it("is a fieldset with a legend, radios from 0 to 10 and described ends", () => {
        const { document } = render("numeric-rating-scale-picker", {
            label: "How bad is your pain now?",
            minLabel: "No pain",
            maxLabel: "Worst pain imaginable",
            required: true,
        });
        expect(
            document.querySelector("fieldset.numeric-rating-scale-picker legend").textContent,
        ).toBe("How bad is your pain now?");
        const radios = document.querySelectorAll('input[type="radio"]');
        expect([...radios].map((r) => r.value)).toEqual([
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
        expect(
            document.getElementById(radios[0].getAttribute("aria-describedby")).textContent,
        ).toBe("No pain");
        expect(
            document.getElementById(radios[10].getAttribute("aria-describedby")).textContent,
        ).toBe("Worst pain imaginable");
        expect(radios[0].required).toBe(true);
        expect(radios[5].hasAttribute("aria-describedby")).toBe(false);
    });

    it("min, max and value", () => {
        const { document } = render("numeric-rating-scale-picker", {
            label: "Rate it",
            min: 1,
            max: 5,
            value: 3,
        });
        const radios = document.querySelectorAll('input[type="radio"]');
        expect(radios).toHaveLength(5);
        expect(radios[2].checked).toBe(true);
    });
});

import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("duration-view", () => {
    it("renders a time whose datetime is the duration, holding the consumer's words", () => {
        const { document } = render("duration-view", {
            value: "3 days 4 hours",
            duration: "P3DT4H",
        });
        const root = document.querySelector("time.duration-view");
        expect(root.getAttribute("datetime")).toBe("P3DT4H");
        expect(root.textContent).toBe("3 days 4 hours");
        expect(root.hasAttribute("data-negative")).toBe(false);
    });

    it("a negative duration keeps its length as datetime and is marked data-negative", () => {
        const { document } = render("duration-view", { value: "3 days early", duration: "-P3D" });
        const root = document.querySelector("time.duration-view");
        expect(root.getAttribute("datetime")).toBe("P3D");
        expect(root.hasAttribute("data-negative")).toBe(true);
    });

    it("a duration in years or months, or no duration, is no datetime", () => {
        for (const duration of ["P2Y", "P3M", "P1W", "P", "PT", ""]) {
            const { document } = render("duration-view", { value: "words", duration });
            expect(document.querySelector("time.duration-view").hasAttribute("datetime")).toBe(
                false,
            );
        }
    });

    it("names the value with hidden text when a label is given", () => {
        const { document } = render("duration-view", {
            value: "4 days",
            duration: "P4D",
            label: "Length of stay",
        });
        expect(document.querySelector("time.duration-view").textContent).toBe(
            "Length of stay 4 days",
        );
    });
});

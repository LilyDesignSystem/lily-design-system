import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const radios = (document) => [...document.querySelectorAll('input[type="radio"]')];
const texts = (document) =>
    [...document.querySelectorAll("label")].map((l) => l.textContent.trim());

describe("net-promoter-score-picker", () => {
    it("renders a fieldset radiogroup with the base class", () => {
        const { document } = render("net-promoter-score-picker", { label: "Rating" });
        const el = document.querySelector("fieldset.net-promoter-score-picker");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("radiogroup");
        expect(el.getAttribute("aria-label")).toBe("Rating");
    });

    it("prefers aria-labelledby over aria-label", () => {
        const { document } = render("net-promoter-score-picker", { label: "x", labelledBy: "h" });
        const el = document.querySelector("fieldset.net-promoter-score-picker");
        expect(el.getAttribute("aria-labelledby")).toBe("h");
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    it("holds 11 native radios, 0 to 10, sharing one name", () => {
        const { document } = render("net-promoter-score-picker", { label: "Rating" });
        expect(radios(document).map((r) => r.value)).toEqual([
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
        expect(new Set(radios(document).map((r) => r.name))).toEqual(new Set(["nps"]));
        expect(
            radios(render("net-promoter-score-picker", { label: "Rating", name: "q1" }).document)[0]
                .name,
        ).toBe("q1");
    });

    it("each option's text is its number, and each radio is named by it", () => {
        const { document } = render("net-promoter-score-picker", { label: "Score" });
        expect(texts(document)).toEqual(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
        expect(radios(document).map((r) => r.getAttribute("aria-label"))).toEqual([
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
    });

    it("checks the radio for value", () => {
        const { document } = render("net-promoter-score-picker", { label: "Rating", value: 2 });
        expect(radios(document).map((r) => r.checked)).toEqual([
            false,
            false,
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
        ]);
        expect(
            radios(render("net-promoter-score-picker", { label: "Rating" }).document).some(
                (r) => r.checked,
            ),
        ).toBe(false);
    });

    it("passes classes and attributes through", () => {
        const { document } = render("net-promoter-score-picker", {
            label: "Rating",
            classes: "inline",
            attributes: { "data-test": "v" },
        });
        const el = document.querySelector("fieldset.net-promoter-score-picker");
        expect(el.classList.contains("inline")).toBe(true);
        expect(el.getAttribute("data-test")).toBe("v");
    });
});

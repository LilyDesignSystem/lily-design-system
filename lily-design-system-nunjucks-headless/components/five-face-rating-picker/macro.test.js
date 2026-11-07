import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const radios = (document) => [...document.querySelectorAll('input[type="radio"]')];
const texts = (document) =>
    [...document.querySelectorAll("label")].map((l) => l.textContent.trim());

describe("five-face-rating-picker", () => {
    it("renders a fieldset radiogroup with the base class", () => {
        const { document } = render("five-face-rating-picker", { label: "Rating" });
        const el = document.querySelector("fieldset.five-face-rating-picker");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("radiogroup");
        expect(el.getAttribute("aria-label")).toBe("Rating");
    });

    it("prefers aria-labelledby over aria-label", () => {
        const { document } = render("five-face-rating-picker", { label: "x", labelledBy: "h" });
        const el = document.querySelector("fieldset.five-face-rating-picker");
        expect(el.getAttribute("aria-labelledby")).toBe("h");
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    it("holds 5 native radios, 1 to 5, sharing one name", () => {
        const { document } = render("five-face-rating-picker", { label: "Rating" });
        expect(radios(document).map((r) => r.value)).toEqual(["1", "2", "3", "4", "5"]);
        expect(new Set(radios(document).map((r) => r.name))).toEqual(new Set(["face-rating"]));
        expect(
            radios(render("five-face-rating-picker", { label: "Rating", name: "q1" }).document)[0]
                .name,
        ).toBe("q1");
    });

    it("labels give each option its text; without them, the numbers alone", () => {
        expect(
            texts(
                render("five-face-rating-picker", {
                    label: "Rating",
                    labels: ["Très mauvais", "Mauvais", "Moyen", "Bon", "Très bon"],
                }).document,
            ),
        ).toEqual(["Très mauvais", "Mauvais", "Moyen", "Bon", "Très bon"]);
        expect(texts(render("five-face-rating-picker", { label: "Rating" }).document)).toEqual([
            "1",
            "2",
            "3",
            "4",
            "5",
        ]);
    });

    it("checks the radio for value", () => {
        const { document } = render("five-face-rating-picker", { label: "Rating", value: 3 });
        expect(radios(document).map((r) => r.checked)).toEqual([false, false, true, false, false]);
        expect(
            radios(render("five-face-rating-picker", { label: "Rating" }).document).some(
                (r) => r.checked,
            ),
        ).toBe(false);
    });

    it("disabled disables the group", () => {
        const { document } = render("five-face-rating-picker", { label: "Rating", disabled: true });
        expect(
            document.querySelector("fieldset.five-face-rating-picker").hasAttribute("disabled"),
        ).toBe(true);
    });

    it("passes classes and attributes through", () => {
        const { document } = render("five-face-rating-picker", {
            label: "Rating",
            classes: "inline",
            attributes: { "data-test": "v" },
        });
        const el = document.querySelector("fieldset.five-face-rating-picker");
        expect(el.classList.contains("inline")).toBe(true);
        expect(el.getAttribute("data-test")).toBe("v");
    });
});

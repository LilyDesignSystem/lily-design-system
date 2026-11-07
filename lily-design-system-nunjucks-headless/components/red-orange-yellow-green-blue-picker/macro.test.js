import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const statusLabels = {
    red: "Rouge",
    orange: "Orange",
    yellow: "Jaune",
    green: "Vert",
    blue: "Bleu",
};
const radios = (document) => [...document.querySelectorAll('input[type="radio"]')];
const texts = (document) =>
    [...document.querySelectorAll("label")].map((l) => l.textContent.trim());

describe("red-orange-yellow-green-blue-picker", () => {
    it("renders a fieldset radiogroup with the base class", () => {
        const { document } = render("red-orange-yellow-green-blue-picker", {
            label: "Status",
            statusLabels,
        });
        const el = document.querySelector("fieldset.red-orange-yellow-green-blue-picker");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("radiogroup");
        expect(el.getAttribute("aria-label")).toBe("Status");
    });

    it("prefers aria-labelledby over aria-label", () => {
        const { document } = render("red-orange-yellow-green-blue-picker", {
            label: "x",
            labelledBy: "h",
        });
        const el = document.querySelector("fieldset.red-orange-yellow-green-blue-picker");
        expect(el.getAttribute("aria-labelledby")).toBe("h");
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    it("holds one native radio per status, sharing one name", () => {
        const { document } = render("red-orange-yellow-green-blue-picker", {
            label: "Status",
            statusLabels,
        });
        expect(radios(document).map((r) => r.value)).toEqual([
            "red",
            "orange",
            "yellow",
            "green",
            "blue",
        ]);
        expect(new Set(radios(document).map((r) => r.name))).toEqual(new Set(["status"]));
        const named = render("red-orange-yellow-green-blue-picker", {
            label: "Status",
            name: "q1",
        }).document;
        expect(radios(named)[0].name).toBe("q1");
    });

    it("statusLabels give each option its text; without them, the value", () => {
        expect(
            texts(
                render("red-orange-yellow-green-blue-picker", { label: "Status", statusLabels })
                    .document,
            ),
        ).toEqual(["Rouge", "Orange", "Jaune", "Vert", "Bleu"]);
        expect(
            texts(render("red-orange-yellow-green-blue-picker", { label: "Status" }).document),
        ).toEqual(["red", "orange", "yellow", "green", "blue"]);
    });

    it("checks the radio for value", () => {
        const { document } = render("red-orange-yellow-green-blue-picker", {
            label: "Status",
            value: "orange",
        });
        expect(radios(document).map((r) => r.checked)).toEqual([false, true, false, false, false]);
    });

    it("disabled disables the group, and classes and attributes pass through", () => {
        const { document } = render("red-orange-yellow-green-blue-picker", {
            label: "Status",
            disabled: true,
            classes: "inline",
            attributes: { "data-test": "v" },
        });
        const el = document.querySelector("fieldset.red-orange-yellow-green-blue-picker");
        expect(el.hasAttribute("disabled")).toBe(true);
        expect(el.classList.contains("inline")).toBe(true);
        expect(el.getAttribute("data-test")).toBe("v");
    });
});

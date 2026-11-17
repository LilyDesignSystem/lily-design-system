import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

const items = [
    {
        legend: "Medicine 1",
        removeLabel: "Remove medicine 1",
        html: '<label>Name <input name="medicine-0"></label>',
    },
    {
        legend: "Medicine 2",
        removeLabel: "Remove medicine 2",
        html: '<label>Name <input name="medicine-1"></label>',
    },
];

describe("repeatable-fieldset", () => {
    it("renders a named fieldset with one named fieldset per item and submit buttons for the server", () => {
        const { document } = render("repeatable-fieldset", {
            legend: "Medicines",
            name: "medicines",
            addLabel: "Add another medicine",
            items,
        });
        const root = document.querySelector("fieldset.repeatable-fieldset");
        expect(root.querySelector(":scope > legend").textContent).toBe("Medicines");
        const fieldsets = root.querySelectorAll(".repeatable-fieldset-item");
        expect([...fieldsets].map((f) => f.querySelector("legend").textContent)).toEqual([
            "Medicine 1",
            "Medicine 2",
        ]);
        const remove = fieldsets[1].querySelector(".repeatable-fieldset-remove");
        expect(remove.getAttribute("type")).toBe("submit");
        expect(remove.getAttribute("name")).toBe("medicines-remove");
        expect(remove.getAttribute("value")).toBe("1");
        expect(root.querySelector(".repeatable-fieldset-add").getAttribute("name")).toBe(
            "medicines-add",
        );
    });

    it("min leaves out the remove buttons; max disables the add button", () => {
        const { document } = render("repeatable-fieldset", {
            legend: "Medicines",
            name: "medicines",
            addLabel: "Add another medicine",
            items: [items[0]],
            min: 1,
            max: 1,
        });
        expect(document.querySelector(".repeatable-fieldset-remove")).toBeNull();
        expect(document.querySelector(".repeatable-fieldset-add").hasAttribute("disabled")).toBe(
            true,
        );
    });
});

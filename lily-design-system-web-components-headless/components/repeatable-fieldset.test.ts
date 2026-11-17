import { afterEach, describe, expect, test } from "vitest";

import { RepeatableFieldset } from "./repeatable-fieldset.js";

if (!customElements.get("lily-repeatable-fieldset"))
    customElements.define("lily-repeatable-fieldset", RepeatableFieldset);

afterEach(() => {
    document.body.innerHTML = "";
});

const make = (attrs: string) => {
    document.body.innerHTML = `<lily-repeatable-fieldset legend="Medicines" item-legend="Medicine {n}" add-label="Add another medicine" remove-label="Remove medicine {n}" added-label="Medicine {n} added" removed-label="Medicine {n} removed" ${attrs}><template><label>Name <input name="medicine[]"></label></template></lily-repeatable-fieldset>`;
    return document.querySelector("lily-repeatable-fieldset") as RepeatableFieldset;
};
const items = () =>
    [...document.querySelectorAll(".repeatable-fieldset-item")] as HTMLFieldSetElement[];
const legends = () => items().map((el) => el.querySelector("legend")?.textContent);
const add = () => document.querySelector(".repeatable-fieldset-add") as HTMLButtonElement;

describe("RepeatableFieldset", () => {
    test("add appends a clone of the template, renumbers, announces, and moves focus to its first field", () => {
        make('count="1"');
        add().click();
        expect(legends()).toEqual(["Medicine 1", "Medicine 2"]);
        expect(document.activeElement).toBe(items()[1].querySelector("input"));
        expect(document.querySelector('[role="status"]')?.textContent).toBe("Medicine 2 added");
    });

    test("remove takes out that item, keeps the others' values, and moves focus to the add button", () => {
        make('count="3"');
        items().forEach(
            (item, i) =>
                ((item.querySelector("input") as HTMLInputElement).value = ["A", "B", "C"][i]),
        );
        (items()[1].querySelector(".repeatable-fieldset-remove") as HTMLButtonElement).click();
        expect(legends()).toEqual(["Medicine 1", "Medicine 2"]);
        expect(
            items().map((item) => (item.querySelector("input") as HTMLInputElement).value),
        ).toEqual(["A", "C"]);
        expect(items()[1].querySelector(".repeatable-fieldset-remove")?.textContent).toBe(
            "Remove medicine 2",
        );
        expect(document.activeElement).toBe(add());
    });

    test("min hides the remove buttons; max disables the add button", () => {
        make('count="1" min="1" max="1"');
        expect(
            (items()[0].querySelector(".repeatable-fieldset-remove") as HTMLButtonElement).hidden,
        ).toBe(true);
        expect(add().disabled).toBe(true);
    });
});

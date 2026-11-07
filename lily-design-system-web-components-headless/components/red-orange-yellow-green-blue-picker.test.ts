import { afterEach, describe, expect, test } from "vitest";
import { userEvent } from "@testing-library/user-event";

import { RedOrangeYellowGreenBluePicker } from "./red-orange-yellow-green-blue-picker.js";

if (!customElements.get("lily-red-orange-yellow-green-blue-picker"))
    customElements.define(
        "lily-red-orange-yellow-green-blue-picker",
        RedOrangeYellowGreenBluePicker,
    );

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}
const radios = () => Array.from(document.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
const texts = () =>
    Array.from(document.querySelectorAll("label")).map((l) => l.textContent!.trim());

describe("RedOrangeYellowGreenBluePicker", () => {
    test("renders a fieldset radiogroup named by label", () => {
        const host = render(
            '<lily-red-orange-yellow-green-blue-picker label="Status" class="extra"></lily-red-orange-yellow-green-blue-picker>',
        );
        const root = host.querySelector("fieldset.red-orange-yellow-green-blue-picker")!;
        expect(root.getAttribute("role")).toBe("radiogroup");
        expect(root.getAttribute("aria-label")).toBe("Status");
        expect(root.classList.contains("extra")).toBe(true);
    });

    test("holds one native radio per status, sharing one name", () => {
        render(
            '<lily-red-orange-yellow-green-blue-picker label="Status"></lily-red-orange-yellow-green-blue-picker>',
        );
        expect(radios().map((r) => r.value)).toEqual(["red", "orange", "yellow", "green", "blue"]);
        expect(new Set(radios().map((r) => r.name))).toEqual(new Set(["status"]));
    });

    test("the -label attributes give each option its text; without them, the value", () => {
        render(
            '<lily-red-orange-yellow-green-blue-picker label="Status" red-label="Rouge" orange-label="Orange" yellow-label="Jaune" green-label="Vert" blue-label="Bleu"></lily-red-orange-yellow-green-blue-picker>',
        );
        expect(texts()).toEqual(["Rouge", "Orange", "Jaune", "Vert", "Bleu"]);
        render(
            '<lily-red-orange-yellow-green-blue-picker label="Status"></lily-red-orange-yellow-green-blue-picker>',
        );
        expect(texts()).toEqual(["red", "orange", "yellow", "green", "blue"]);
    });

    test("checks the radio for value, and a choice updates value", () => {
        const host = render(
            '<lily-red-orange-yellow-green-blue-picker label="Status" value="orange"></lily-red-orange-yellow-green-blue-picker>',
        );
        expect(radios()[1].checked).toBe(true);
        radios()[0].click();
        expect(host.getAttribute("value")).toBe("red");
    });

    test("ArrowRight moves the selection through the native radio group", async () => {
        const user = userEvent.setup();
        render(
            '<lily-red-orange-yellow-green-blue-picker label="Status"></lily-red-orange-yellow-green-blue-picker>',
        );
        await user.click(radios()[0]);
        await user.keyboard("{ArrowRight}");
        expect(radios()[1].checked).toBe(true);
    });

    test("disabled disables the group", () => {
        const host = render(
            '<lily-red-orange-yellow-green-blue-picker label="Status" disabled></lily-red-orange-yellow-green-blue-picker>',
        );
        expect(host.querySelector("fieldset")!.disabled).toBe(true);
    });
});

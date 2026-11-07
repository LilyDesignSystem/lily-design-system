import { afterEach, describe, expect, test } from "vitest";
import { userEvent } from "@testing-library/user-event";

import { RedAmberGreenPicker } from "./red-amber-green-picker.js";

if (!customElements.get("lily-red-amber-green-picker"))
    customElements.define("lily-red-amber-green-picker", RedAmberGreenPicker);

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

describe("RedAmberGreenPicker", () => {
    test("renders a fieldset radiogroup named by label", () => {
        const host = render(
            '<lily-red-amber-green-picker label="Status" class="extra"></lily-red-amber-green-picker>',
        );
        const root = host.querySelector("fieldset.red-amber-green-picker")!;
        expect(root.getAttribute("role")).toBe("radiogroup");
        expect(root.getAttribute("aria-label")).toBe("Status");
        expect(root.classList.contains("extra")).toBe(true);
    });

    test("holds one native radio per status, sharing one name", () => {
        render('<lily-red-amber-green-picker label="Status"></lily-red-amber-green-picker>');
        expect(radios().map((r) => r.value)).toEqual(["red", "amber", "green"]);
        expect(new Set(radios().map((r) => r.name))).toEqual(new Set(["status"]));
    });

    test("the -label attributes give each option its text; without them, the value", () => {
        render(
            '<lily-red-amber-green-picker label="Status" red-label="Rouge" amber-label="Ambre" green-label="Vert"></lily-red-amber-green-picker>',
        );
        expect(texts()).toEqual(["Rouge", "Ambre", "Vert"]);
        render('<lily-red-amber-green-picker label="Status"></lily-red-amber-green-picker>');
        expect(texts()).toEqual(["red", "amber", "green"]);
    });

    test("checks the radio for value, and a choice updates value", () => {
        const host = render(
            '<lily-red-amber-green-picker label="Status" value="amber"></lily-red-amber-green-picker>',
        );
        expect(radios()[1].checked).toBe(true);
        radios()[0].click();
        expect(host.getAttribute("value")).toBe("red");
    });

    test("ArrowRight moves the selection through the native radio group", async () => {
        const user = userEvent.setup();
        render('<lily-red-amber-green-picker label="Status"></lily-red-amber-green-picker>');
        await user.click(radios()[0]);
        await user.keyboard("{ArrowRight}");
        expect(radios()[1].checked).toBe(true);
    });

    test("disabled disables the group", () => {
        const host = render(
            '<lily-red-amber-green-picker label="Status" disabled></lily-red-amber-green-picker>',
        );
        expect(host.querySelector("fieldset")!.disabled).toBe(true);
    });
});

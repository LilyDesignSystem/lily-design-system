import { afterEach, describe, expect, test } from "vitest";
import { userEvent } from "@testing-library/user-event";

import { NetPromoterScorePicker } from "./net-promoter-score-picker.js";

if (!customElements.get("lily-net-promoter-score-picker"))
    customElements.define("lily-net-promoter-score-picker", NetPromoterScorePicker);

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

describe("NetPromoterScorePicker", () => {
    test("renders a fieldset radiogroup named by label", () => {
        const host = render(
            '<lily-net-promoter-score-picker label="Rating" class="extra"></lily-net-promoter-score-picker>',
        );
        const root = host.querySelector("fieldset.net-promoter-score-picker")!;
        expect(root.getAttribute("role")).toBe("radiogroup");
        expect(root.getAttribute("aria-label")).toBe("Rating");
        expect(root.classList.contains("extra")).toBe(true);
    });

    test("holds 11 native radios, sharing one name", () => {
        render('<lily-net-promoter-score-picker label="Rating"></lily-net-promoter-score-picker>');
        expect(radios().map((r) => r.value)).toEqual([
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
        expect(new Set(radios().map((r) => r.name))).toEqual(new Set(["nps"]));
    });

    test("each option's text is its number, and each radio is named by it", () => {
        render('<lily-net-promoter-score-picker label="Score"></lily-net-promoter-score-picker>');
        expect(texts()).toEqual(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
        expect(radios().map((r) => r.getAttribute("aria-label"))).toEqual([
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

    test("checks the radio for value, and a choice updates value", () => {
        const host = render(
            '<lily-net-promoter-score-picker label="Rating" value="2"></lily-net-promoter-score-picker>',
        );
        expect(radios().map((r) => r.checked)).toEqual([
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
        radios()[0].click();
        expect(host.getAttribute("value")).toBe("0");
    });

    test("ArrowRight moves the selection through the native radio group", async () => {
        const user = userEvent.setup();
        render('<lily-net-promoter-score-picker label="Rating"></lily-net-promoter-score-picker>');
        await user.click(radios()[0]);
        await user.keyboard("{ArrowRight}");
        expect(radios()[1].checked).toBe(true);
    });
});

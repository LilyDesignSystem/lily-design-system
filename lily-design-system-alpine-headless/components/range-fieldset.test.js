// range-fieldset.test.js
// RangeFieldset component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("fieldset.range-fieldset");
const lower = () => el().querySelector(".range-fieldset-minimum");
const upper = () => el().querySelector(".range-fieldset-maximum");
const move = async (input, value) => {
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
};

describe("RangeFieldset", () => {
    it("renders the element with its base class", async () => {
        await mount("range-fieldset");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("range-fieldset")).toBe(true);
    });

    it("is a fieldset with a legend and two range inputs on one scale", async () => {
        await mount("range-fieldset");
        expect(el().querySelector("legend.range-fieldset-legend")).toBeTruthy();
        for (const input of [lower(), upper()]) {
            expect(input.type).toBe("range");
            expect(input.min).toBe("0");
            expect(input.max).toBe("100");
        }
    });
    it("the lower thumb stops at the upper one, and the upper at the lower", async () => {
        await mount("range-fieldset");
        await move(lower(), "90");
        expect(lower().value).toBe("80");
        await move(lower(), "30");
        await move(upper(), "10");
        expect(upper().value).toBe("30");
    });
    it("a form reset puts both thumbs back", async () => {
        await mount("range-fieldset");
        const fieldset = el();
        const form = document.createElement("form");
        fieldset.replaceWith(form);
        form.append(fieldset);
        await move(lower(), "40");
        form.reset();
        expect(lower().value).toBe("20");
        expect(upper().value).toBe("80");
    });
    it("after a form reset the thumbs stay back, and the next move clamps against them", async () => {
        await mount("range-fieldset");
        const fieldset = el();
        const form = document.createElement("form");
        fieldset.replaceWith(form);
        form.append(fieldset);
        await move(lower(), "50");
        form.reset();
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(lower().value).toBe("20");
        await move(upper(), "30");
        expect(upper().value).toBe("30");
    });
});

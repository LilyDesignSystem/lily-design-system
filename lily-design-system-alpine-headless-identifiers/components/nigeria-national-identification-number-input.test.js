// nigeria-national-identification-number-input.test.js
// NigeriaNationalIdentificationNumberInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.nigeria-national-identification-number-input");

describe("NigeriaNationalIdentificationNumberInput", () => {
    it("renders the element with its base class", async () => {
        await mount("nigeria-national-identification-number-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("nigeria-national-identification-number-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("nigeria-national-identification-number-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});

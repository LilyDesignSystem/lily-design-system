// ityopya-fayda-identification-number-input.test.js
// ItyopyaFaydaIdentificationNumberInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.ityopya-fayda-identification-number-input");

describe("ItyopyaFaydaIdentificationNumberInput", () => {
    it("renders the element with its base class", async () => {
        await mount("ityopya-fayda-identification-number-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("ityopya-fayda-identification-number-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("ityopya-fayda-identification-number-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});

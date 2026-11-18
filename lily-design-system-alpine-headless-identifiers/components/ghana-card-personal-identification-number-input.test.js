// ghana-card-personal-identification-number-input.test.js
// GhanaCardPersonalIdentificationNumberInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.ghana-card-personal-identification-number-input");

describe("GhanaCardPersonalIdentificationNumberInput", () => {
    it("renders the element with its base class", async () => {
        await mount("ghana-card-personal-identification-number-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("ghana-card-personal-identification-number-input")).toBe(
            true,
        );
    });

    it("uses the input element", async () => {
        await mount("ghana-card-personal-identification-number-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});

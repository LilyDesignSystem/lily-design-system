// australia-tax-file-number-input.test.js
// AustraliaTaxFileNumberInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.australia-tax-file-number-input");

describe("AustraliaTaxFileNumberInput", () => {
    it("renders the element with its base class", async () => {
        await mount("australia-tax-file-number-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("australia-tax-file-number-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("australia-tax-file-number-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});

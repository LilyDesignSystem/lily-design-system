// iran-kod-e-melli-input.test.js
// IranKodEMelliInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.iran-kod-e-melli-input");

describe("IranKodEMelliInput", () => {
    it("renders the element with its base class", async () => {
        await mount("iran-kod-e-melli-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("iran-kod-e-melli-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("iran-kod-e-melli-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});

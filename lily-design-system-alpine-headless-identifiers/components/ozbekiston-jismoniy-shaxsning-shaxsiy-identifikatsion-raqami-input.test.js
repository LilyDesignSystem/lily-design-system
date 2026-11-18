// ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input.test.js
// OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () =>
    document.querySelector(
        "input.ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input",
    );

describe("OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiInput", () => {
    it("renders the element with its base class", async () => {
        await mount("ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input");
        expect(el()).not.toBeNull();
        expect(
            el().classList.contains(
                "ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input",
            ),
        ).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});

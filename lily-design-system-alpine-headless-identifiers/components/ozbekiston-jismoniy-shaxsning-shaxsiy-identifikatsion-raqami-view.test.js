// ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view.test.js
// OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () =>
    document.querySelector(
        "span.ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view",
    );

describe("OzbekistonJismoniyShaxsningShaxsiyIdentifikatsionRaqamiView", () => {
    it("renders the element with its base class", async () => {
        await mount("ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view");
        expect(el()).not.toBeNull();
        expect(
            el().classList.contains(
                "ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view",
            ),
        ).toBe(true);
    });

    it("uses the span element", async () => {
        await mount("ozbekiston-jismoniy-shaxsning-shaxsiy-identifikatsion-raqami-view");
        expect(el().tagName.toLowerCase()).toBe("span");
    });
});

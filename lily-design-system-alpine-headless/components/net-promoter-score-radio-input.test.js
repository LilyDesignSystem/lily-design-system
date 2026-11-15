// net-promoter-score-radio-input.test.js
// NetPromoterScoreRadioInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.net-promoter-score-radio-input");

describe("NetPromoterScoreRadioInput", () => {
    it("renders the element with its base class", async () => {
        await mount("net-promoter-score-radio-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("net-promoter-score-radio-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("net-promoter-score-radio-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});

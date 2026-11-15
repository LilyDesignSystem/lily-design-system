// net-promoter-score-radio-group.test.js
// NetPromoterScoreRadioGroup component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("fieldset.net-promoter-score-radio-group");

describe("NetPromoterScoreRadioGroup", () => {
    it("renders the element with its base class", async () => {
        await mount("net-promoter-score-radio-group");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("net-promoter-score-radio-group")).toBe(true);
    });

    it("uses the fieldset element", async () => {
        await mount("net-promoter-score-radio-group");
        expect(el().tagName.toLowerCase()).toBe("fieldset");
    });
});

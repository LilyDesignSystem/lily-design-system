// five-face-rating-radio-group.test.js
// FiveFaceRatingRadioGroup component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("fieldset.five-face-rating-radio-group");

describe("FiveFaceRatingRadioGroup", () => {
    it("renders the element with its base class", async () => {
        await mount("five-face-rating-radio-group");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("five-face-rating-radio-group")).toBe(true);
    });

    it("uses the fieldset element", async () => {
        await mount("five-face-rating-radio-group");
        expect(el().tagName.toLowerCase()).toBe("fieldset");
    });
});

// five-face-rating-radio-input.test.js
// FiveFaceRatingRadioInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.five-face-rating-radio-input");

describe("FiveFaceRatingRadioInput", () => {
    it("renders the element with its base class", async () => {
        await mount("five-face-rating-radio-input");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("five-face-rating-radio-input")).toBe(true);
    });

    it("uses the input element", async () => {
        await mount("five-face-rating-radio-input");
        expect(el().tagName.toLowerCase()).toBe("input");
    });
});

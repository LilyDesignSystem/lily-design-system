// five-star-rating-radio-group.test.js
// FiveStarRatingRadioGroup component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("fieldset.five-star-rating-radio-group");

describe("FiveStarRatingRadioGroup", () => {
    it("renders the element with its base class", async () => {
        await mount("five-star-rating-radio-group");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("five-star-rating-radio-group")).toBe(true);
    });

    it("uses the fieldset element", async () => {
        await mount("five-star-rating-radio-group");
        expect(el().tagName.toLowerCase()).toBe("fieldset");
    });
});

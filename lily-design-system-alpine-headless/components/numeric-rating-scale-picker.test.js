// numeric-rating-scale-picker.test.js
// NumericRatingScalePicker component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("fieldset.numeric-rating-scale-picker");

describe("NumericRatingScalePicker", () => {
    it("renders the element with its base class", async () => {
        await mount("numeric-rating-scale-picker");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("numeric-rating-scale-picker")).toBe(true);
    });

    it("uses the fieldset element", async () => {
        await mount("numeric-rating-scale-picker");
        expect(el().tagName.toLowerCase()).toBe("fieldset");
    });
});

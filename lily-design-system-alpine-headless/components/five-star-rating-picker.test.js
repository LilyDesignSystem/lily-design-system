// five-star-rating-picker.test.js
// FiveStarRatingPicker component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("fieldset.five-star-rating-picker");
import { userEvent } from "@testing-library/user-event";

describe("FiveStarRatingPicker", () => {
    it("renders the element with its base class", async () => {
        await mount("five-star-rating-picker");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("five-star-rating-picker")).toBe(true);
    });

    const radios = () => [...document.querySelectorAll("input[type=radio]")];
    it("ArrowRight and ArrowLeft move the selection through the native radio group", async () => {
        // The arrows are the browser's (user-event plays them in jsdom); what this guards is the shared name.
        const user = userEvent.setup();
        await mount("five-star-rating-picker");
        const r = radios();
        await user.click(r[1]);
        await user.keyboard("{ArrowRight}");
        expect(r[2].checked).toBe(true);
        expect(document.activeElement).toBe(r[2]);
        await user.keyboard("{ArrowLeft}{ArrowLeft}");
        expect(r[0].checked).toBe(true);
    });
    it("renders 5 native radios that share one name", async () => {
        await mount("five-star-rating-picker");
        expect(el().getAttribute("role")).toBe("radiogroup");
        expect(radios()).toHaveLength(5);
        expect(new Set(radios().map((r) => r.name))).toEqual(new Set(["rating"]));
        expect(radios().every((r) => !r.checked)).toBe(true);
    });
    it("choosing a radio unchecks the others and updates data-value", async () => {
        await mount("five-star-rating-picker");
        radios()[2].click();
        await tick();
        expect(radios().map((r) => r.checked)).toEqual(radios().map((_, i) => i === 2));
        expect(el().getAttribute("data-value")).toBe("3");
        radios()[0].click();
        await tick();
        expect(el().getAttribute("data-value")).toBe("1");
    });
    it("a disabled fieldset disables every radio", async () => {
        await mount("five-star-rating-picker");
        el().disabled = true;
        expect(radios().every((r) => r.matches(":disabled"))).toBe(true);
    });
});

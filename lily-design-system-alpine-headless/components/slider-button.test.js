// slider-button.test.js
// SliderButton component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("button.slider-button");
const press = async (target, key, init = {}) => {
    target.dispatchEvent(
        new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }),
    );
    await tick();
};
const now = () => el().getAttribute("aria-valuenow");

describe("SliderButton", () => {
    it("renders the element with its base class", async () => {
        await mount("slider-button");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("slider-button")).toBe(true);
    });

    it("is a button with role slider at 0 of 100", async () => {
        await mount("slider-button");
        expect(el().getAttribute("type")).toBe("button");
        expect(el().getAttribute("role")).toBe("slider");
        expect([
            now(),
            el().getAttribute("aria-valuemin"),
            el().getAttribute("aria-valuemax"),
        ]).toEqual(["0", "0", "100"]);
    });
    it("ArrowRight and ArrowLeft move by the step; Home returns to 0", async () => {
        await mount("slider-button");
        await press(el(), "ArrowRight");
        await press(el(), "ArrowRight");
        expect(now()).toBe("20");
        await press(el(), "ArrowLeft");
        expect(now()).toBe("10");
        await press(el(), "Home");
        expect(now()).toBe("0");
        await press(el(), "ArrowLeft");
        expect(now()).toBe("0");
    });
    it("reaching 100 dispatches lily:confirm once and resets", async () => {
        await mount("slider-button");
        const confirmed = vi.fn();
        el().addEventListener("lily:confirm", confirmed);
        for (let i = 0; i < 9; i++) await press(el(), "ArrowRight");
        expect(confirmed).not.toHaveBeenCalled();
        await press(el(), "ArrowRight");
        expect(confirmed).toHaveBeenCalledTimes(1);
        expect(now()).toBe("0");
    });
    it("End, Enter and Space confirm at once; a disabled button ignores the keys", async () => {
        await mount("slider-button");
        const confirmed = vi.fn();
        el().addEventListener("lily:confirm", confirmed);
        for (const key of ["End", "Enter", " "]) await press(el(), key);
        expect(confirmed).toHaveBeenCalledTimes(3);
        el().disabled = true;
        await press(el(), "End");
        await press(el(), "ArrowRight");
        expect(confirmed).toHaveBeenCalledTimes(3);
        expect(now()).toBe("0");
    });
});

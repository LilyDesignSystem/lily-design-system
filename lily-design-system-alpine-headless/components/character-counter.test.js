// character-counter.test.js
// CharacterCounter component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.character-counter");
import { snippet } from "../test/mount.js";
const press = async (target, key, init = {}) => {
    target.dispatchEvent(
        new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }),
    );
    await tick();
};
const type = async (field, text) => {
    field.value = text;
    field.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
};

const field = () => document.getElementById("character-counter-field-1");
const shown = () => el().querySelector(".character-counter-text");
const status = () => el().querySelector('[role="status"]');

describe("CharacterCounter", () => {
    it("renders the element with its base class", async () => {
        await mount("character-counter");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("character-counter")).toBe(true);
    });

    it("shows an aria-hidden count and a hidden status, both 0 / max at first", async () => {
        await mount("character-counter");
        expect(el().hasAttribute("role")).toBe(false);
        expect(el().hasAttribute("aria-live")).toBe(false);
        expect(shown().getAttribute("aria-hidden")).toBe("true");
        expect(shown().textContent).toBe("0 / 20");
        expect(status().textContent).toBe("0 / 20");
        expect(el().getAttribute("data-remaining")).toBe("20");
        expect(el().hasAttribute("data-over-limit")).toBe(false);
    });
    it("follows the field it counts", async () => {
        await mount("character-counter");
        await type(field(), "hello");
        expect(shown().textContent).toBe("5 / 20");
        expect(el().getAttribute("data-count")).toBe("5");
        expect(el().getAttribute("data-remaining")).toBe("15");
    });
    it("flags data-over-limit only past the maximum", async () => {
        await mount("character-counter");
        await type(field(), "x".repeat(20));
        expect(el().hasAttribute("data-over-limit")).toBe(false);
        await type(field(), "x".repeat(23));
        expect(el().hasAttribute("data-over-limit")).toBe(true);
        expect(el().getAttribute("data-remaining")).toBe("-3");
    });
    it("a run of keystrokes is announced once, after the pause", async () => {
        await mount("character-counter");
        vi.useFakeTimers();
        for (const text of ["a", "ab", "abc"]) {
            field().value = text;
            field().dispatchEvent(new Event("input"));
            await vi.advanceTimersByTimeAsync(300);
        }
        expect(shown().textContent).toBe("3 / 20");
        expect(status().textContent).toBe("0 / 20");
        await vi.advanceTimersByTimeAsync(1000);
        expect(status().textContent).toBe("3 / 20");
        vi.useRealTimers();
    });
    it("without a maximum it shows just the count", async () => {
        await mount(
            "character-counter",
            snippet("character-counter").replace(
                "lilyCharacterCounter(20,",
                "lilyCharacterCounter(null,",
            ),
        );
        await type(field(), "abc");
        expect(shown().textContent).toBe("3");
        expect(el().hasAttribute("data-max")).toBe(false);
        expect(el().hasAttribute("data-over-limit")).toBe(false);
    });
});

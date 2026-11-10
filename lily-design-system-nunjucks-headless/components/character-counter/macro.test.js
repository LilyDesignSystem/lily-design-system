import { describe, it, expect, vi } from "vitest";
import { autoInit } from "../widget-init.js";
import { render } from "../../test/render.js";

describe("character-counter", () => {
    it("renders a <span> with an aria-hidden count and a hidden status, the numbers alone, as Svelte does: no English", () => {
        const { document } = render("character-counter", {
            value: 42,
            maximum: 100,
            label: "Used",
        });
        const el = document.querySelector("span.character-counter");
        expect(el.hasAttribute("role")).toBe(false);
        expect(el.hasAttribute("aria-live")).toBe(false);
        const shown = el.querySelector(".character-counter-text");
        expect(shown.getAttribute("aria-hidden")).toBe("true");
        expect(shown.textContent).toBe("42 / 100");
        const status = el.querySelector(".character-counter-status");
        expect(status.getAttribute("role")).toBe("status");
        expect(status.getAttribute("aria-label")).toBe("Used");
        expect(status.classList.contains("screen-reader-span")).toBe(true);
        expect(status.textContent).toBe("42 / 100");
    });

    it("omits the maximum when none is provided", () => {
        const { document } = render("character-counter", { value: 5 });
        expect(document.querySelector(".character-counter-text").textContent).toBe("5");
    });

    it("renders 'for' as data-for, and widget-init counts that field, announcing once after the pause", () => {
        const { document } = render("character-counter", { value: 0, maximum: 10, for: "msg" });
        const el = document.querySelector("span.character-counter");
        expect(el.getAttribute("data-for")).toBe("msg");
        const field = document.createElement("input");
        field.id = "msg";
        document.body.append(field);
        vi.useFakeTimers();
        autoInit(document);
        const status = el.querySelector('[role="status"]');
        for (const text of ["a", "ab", "abc"]) {
            field.value = text;
            field.dispatchEvent(new document.defaultView.Event("input"));
            vi.advanceTimersByTime(300);
        }
        expect(el.querySelector(".character-counter-text").textContent).toBe("3 / 10");
        expect(el.dataset.count).toBe("3");
        expect(el.dataset.remaining).toBe("7");
        expect(status.textContent).toBe("0 / 10");
        vi.advanceTimersByTime(1000);
        expect(status.textContent).toBe("3 / 10");
        vi.useRealTimers();
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("character-counter", { value: 0 });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });

    it("shows the consumer's own words when given text", () => {
        const { document } = render("character-counter", {
            value: 3,
            maximum: 10,
            text: "3 de 10 caractères",
        });
        expect(document.querySelector(".character-counter-text").textContent).toBe(
            "3 de 10 caractères",
        );
    });

    it("renders data-count, data-max, data-remaining, and data-over-limit past the maximum", () => {
        const el = render("character-counter", { value: 42, maximum: 100 }).document.querySelector(
            "span.character-counter",
        );
        expect([el.dataset.count, el.dataset.max, el.dataset.remaining]).toEqual([
            "42",
            "100",
            "58",
        ]);
        expect(el.hasAttribute("data-over-limit")).toBe(false);
        const over = render("character-counter", { count: 120, max: 100 }).document.querySelector(
            "span.character-counter",
        );
        expect(over.hasAttribute("data-over-limit")).toBe(true);
        expect(over.dataset.remaining).toBe("-20");
    });
});

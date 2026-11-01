import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("autosuggest", () => {
    it("renders a <div> with the base class", () => {
        const { document } = render("autosuggest", { label: "Test" });
        const el = document.querySelector(".autosuggest");
        expect(el).toBeTruthy();
    });

    it("appends params.classes to the root element", () => {
        const { document } = render("autosuggest", { label: "Test", classes: "extra" });
        const el = document.querySelector(".autosuggest.extra");
        expect(el).toBeTruthy();
    });

    it("renders an input combobox controlling a hidden listbox of the suggestions", () => {
        const { document } = render("autosuggest", {
            label: "Fruit",
            id: "fruit",
            value: "ap",
            name: "fruit",
            suggestions: [
                { value: "apple", label: "Apple" },
                { value: "apricot", label: "Apricot" },
            ],
        });
        const input = document.querySelector(".autosuggest-input");
        const list = document.querySelector(".autosuggest-list");
        expect(input.getAttribute("role")).toBe("combobox");
        expect(input.getAttribute("aria-label")).toBe("Fruit");
        expect(input.getAttribute("aria-autocomplete")).toBe("list");
        expect(input.getAttribute("aria-expanded")).toBe("false");
        expect(input.getAttribute("aria-controls")).toBe("fruit-list");
        expect(input.getAttribute("value")).toBe("ap");
        expect(input.getAttribute("name")).toBe("fruit");
        expect(list.id).toBe("fruit-list");
        expect(list.getAttribute("role")).toBe("listbox");
        expect(list.hasAttribute("hidden")).toBe(true);
        const options = [...list.querySelectorAll('[role="option"]')];
        expect(options.map((o) => [o.id, o.getAttribute("data-value"), o.textContent])).toEqual([
            ["fruit-list-option-0", "apple", "Apple"],
            ["fruit-list-option-1", "apricot", "Apricot"],
        ]);
    });

    it("contains no <style> or <script> tags", () => {
        const { html } = render("autosuggest", { label: "Test" });
        expect(html).not.toContain("<style");
        expect(html).not.toContain("<script");
    });
});

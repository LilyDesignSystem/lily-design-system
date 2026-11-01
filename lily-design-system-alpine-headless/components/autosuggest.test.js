// autosuggest.test.js
// Autosuggest component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.autosuggest");
const input = () => document.querySelector(".autosuggest-input");
const list = () => document.querySelector(".autosuggest-list");
const opts = () => [...document.querySelectorAll(".autosuggest-option")];
const active = () =>
    opts().findIndex((o) => o.id === input().getAttribute("aria-activedescendant"));
const suggest = async (values) => {
    list().innerHTML = values
        .map(
            (v) =>
                `<li class="autosuggest-option" role="option" data-value="${v}">${v.toUpperCase()}</li>`,
        )
        .join("");
    await tick();
};
const type = async (text) => {
    input().value = text;
    input().dispatchEvent(new Event("input", { bubbles: true }));
    await tick();
};
const fruit = ["apple", "apricot", "avocado"];
const press = async (target, key, init = {}) => {
    target.dispatchEvent(
        new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }),
    );
    await tick();
};

describe("Autosuggest", () => {
    it("renders the element with its base class", async () => {
        await mount("autosuggest");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("autosuggest")).toBe(true);
    });

    it("starts closed with the combobox contract on the input", async () => {
        await mount("autosuggest");
        expect(input().getAttribute("role")).toBe("combobox");
        expect(input().getAttribute("aria-expanded")).toBe("false");
        expect(input().getAttribute("aria-autocomplete")).toBe("list");
        expect(input().getAttribute("aria-controls")).toBe(list().id);
        expect(list().getAttribute("role")).toBe("listbox");
        expect(list().hidden).toBe(true);
    });
    it("typing announces lily:input and opens once suggestions are rendered", async () => {
        await mount("autosuggest");
        const seen = vi.fn();
        el().addEventListener("lily:input", (e) => seen(e.detail));
        await type("ap");
        expect(seen).toHaveBeenCalledWith({ value: "ap" });
        expect(input().getAttribute("aria-expanded")).toBe("false");
        await suggest(fruit);
        expect(input().getAttribute("aria-expanded")).toBe("true");
        expect(list().hidden).toBe(false);
    });
    it("ArrowDown and ArrowUp move the highlight, wrapping", async () => {
        await mount("autosuggest");
        await suggest(fruit);
        await press(input(), "ArrowDown");
        expect(input().getAttribute("aria-expanded")).toBe("true");
        expect(active()).toBe(0);
        expect(opts()[0].getAttribute("aria-selected")).toBe("true");
        await press(input(), "ArrowDown");
        expect(active()).toBe(1);
        await press(input(), "ArrowUp");
        await press(input(), "ArrowUp");
        expect(active()).toBe(2);
        await press(input(), "ArrowDown");
        expect(active()).toBe(0);
    });
    it("Home and End jump to the first and last option", async () => {
        await mount("autosuggest");
        await suggest(fruit);
        await press(input(), "ArrowDown");
        await press(input(), "End");
        expect(active()).toBe(2);
        await press(input(), "Home");
        expect(active()).toBe(0);
    });
    it("Enter chooses the highlighted option, fills the input, closes and announces lily:select", async () => {
        await mount("autosuggest");
        await suggest(fruit);
        const seen = vi.fn();
        el().addEventListener("lily:select", (e) => seen(e.detail));
        await press(input(), "ArrowDown");
        await press(input(), "ArrowDown");
        await press(input(), "Enter");
        expect(seen).toHaveBeenCalledWith({ value: "apricot" });
        expect(input().value).toBe("apricot");
        expect(input().getAttribute("aria-expanded")).toBe("false");
        expect(input().hasAttribute("aria-activedescendant")).toBe(false);
    });
    it("Escape closes without choosing", async () => {
        await mount("autosuggest");
        await type("ap");
        await suggest(fruit);
        const seen = vi.fn();
        el().addEventListener("lily:select", seen);
        await press(input(), "ArrowDown");
        await press(input(), "Escape");
        expect(input().getAttribute("aria-expanded")).toBe("false");
        expect(seen).not.toHaveBeenCalled();
        expect(input().value).toBe("ap");
    });
    it("pressing an option keeps focus in the input (mousedown is cancelled)", async () => {
        await mount("autosuggest");
        await type("a");
        await suggest(fruit);
        const event = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
        opts()[0].dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
    });
    it("clicking an option chooses it; blur closes the list", async () => {
        await mount("autosuggest");
        await type("a");
        await suggest(fruit);
        opts()[2].click();
        await tick();
        expect(input().value).toBe("avocado");
        await type("av");
        input().dispatchEvent(new Event("blur"));
        await tick();
        expect(input().getAttribute("aria-expanded")).toBe("false");
    });
});

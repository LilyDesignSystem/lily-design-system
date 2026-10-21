// combobox.test.js
// Combobox component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.combobox");
const input = () => document.querySelector(".combobox-input");
const listbox = () => document.querySelector(".combobox-listbox");
const opts = () => [...document.querySelectorAll(".combobox-option")];
const label = async () => { ["Apple", "Banana", "Cherry"].forEach((t, i) => (opts()[i].textContent = t)); await tick(); };
const type = async (text) => { input().value = text; input().dispatchEvent(new Event("input", { bubbles: true })); await tick(); };
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};

describe("Combobox", () => {
  it("renders the element with its base class", async () => {
    await mount("combobox");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("combobox")).toBe(true);
  });

  it("starts closed with the combobox contract on the input", async () => {
    await mount("combobox");
    expect(input().getAttribute("role")).toBe("combobox");
    expect(input().getAttribute("aria-expanded")).toBe("false");
    expect(input().getAttribute("aria-autocomplete")).toBe("list");
    expect(input().getAttribute("aria-controls")).toBe(listbox().id);
    expect(listbox().getAttribute("role")).toBe("listbox");
    expect(listbox().hidden).toBe(true);
  });
  it("typing opens the list and filters the options", async () => {
    await mount("combobox"); await label();
    await type("an");
    expect(listbox().hidden).toBe(false);
    expect(input().getAttribute("aria-expanded")).toBe("true");
    expect(opts().map((o) => o.hidden)).toEqual([true, false, true]);
  });
  it("arrows move the active descendant and Enter chooses it", async () => {
    await mount("combobox"); await label();
    await press(input(), "ArrowDown");
    expect(listbox().hidden).toBe(false);
    expect(input().getAttribute("aria-activedescendant")).toBe(opts()[0].id);
    await press(input(), "ArrowUp");
    expect(input().getAttribute("aria-activedescendant")).toBe(opts()[2].id);
    await press(input(), "Enter");
    expect(input().value).toBe("Cherry");
    expect(listbox().hidden).toBe(true);
    expect(input().hasAttribute("aria-activedescendant")).toBe(false);
  });
  it("clicking an option chooses it", async () => {
    await mount("combobox"); await label();
    await press(input(), "ArrowDown");
    opts()[1].click(); await tick();
    expect(input().value).toBe("Banana");
    expect(listbox().hidden).toBe(true);
  });
  it("Escape and an outside click close it", async () => {
    await mount("combobox");
    await press(input(), "ArrowDown");
    await press(input(), "Escape");
    expect(listbox().hidden).toBe(true);
    await press(input(), "ArrowDown");
    document.body.click(); await tick();
    expect(listbox().hidden).toBe(true);
  });
});

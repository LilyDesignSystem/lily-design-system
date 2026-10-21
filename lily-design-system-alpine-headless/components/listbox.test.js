// listbox.test.js
// Listbox component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.listbox");
const opts = () => [...document.querySelectorAll(".listbox-option")];
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};

describe("Listbox", () => {
  it("renders the element with its base class", async () => {
    await mount("listbox");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("listbox")).toBe(true);
  });

  it('is role="listbox" with role="option" children and one tab stop', async () => {
    await mount("listbox");
    expect(el().getAttribute("role")).toBe("listbox");
    expect(opts().map((o) => o.getAttribute("role"))).toEqual(["option", "option", "option"]);
    expect(opts().map((o) => o.getAttribute("tabindex"))).toEqual(["0", "-1", "-1"]);
    expect(opts().map((o) => o.getAttribute("aria-selected"))).toEqual(["false", "false", "false"]);
  });
  it("arrows wrap and Home/End jump", async () => {
    await mount("listbox");
    opts()[0].focus();
    await press(opts()[0], "ArrowUp");
    expect(document.activeElement).toBe(opts()[2]);
    await press(opts()[2], "ArrowDown");
    expect(document.activeElement).toBe(opts()[0]);
    await press(opts()[0], "End");
    expect(document.activeElement).toBe(opts()[2]);
    await press(opts()[2], "Home");
    expect(document.activeElement).toBe(opts()[0]);
  });
  it("clicking or pressing Enter selects one option at a time", async () => {
    await mount("listbox");
    opts()[1].click(); await tick();
    expect(opts().map((o) => o.getAttribute("aria-selected"))).toEqual(["false", "true", "false"]);
    await press(opts()[2], "Enter");
    expect(opts().map((o) => o.getAttribute("aria-selected"))).toEqual(["false", "false", "true"]);
    expect(opts().map((o) => o.getAttribute("tabindex"))).toEqual(["-1", "-1", "0"]);
  });
  it("announces the selection with lily:select", async () => {
    await mount("listbox");
    const seen = vi.fn();
    el().addEventListener("lily:select", (e) => seen(e.detail));
    opts()[0].click(); await tick();
    expect(seen).toHaveBeenCalledWith({ selected: ["one"] });
  });
});

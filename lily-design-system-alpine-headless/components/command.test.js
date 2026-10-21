// command.test.js
// Command component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.command");
const input = () => document.querySelector(".command-input");
const opts = () => [...document.querySelectorAll(".command-option")];
const label = async () => { ["Open file", "Open folder", "Save all"].forEach((t, i) => (opts()[i].textContent = t)); await tick(); };
const type = async (text) => { input().value = text; input().dispatchEvent(new Event("input", { bubbles: true })); await tick(); };
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};

describe("Command", () => {
  it("renders the element with its base class", async () => {
    await mount("command");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("command")).toBe(true);
  });

  it("is a search landmark holding a search input and a listbox", async () => {
    await mount("command");
    expect(el().getAttribute("role")).toBe("search");
    expect(input().type).toBe("search");
    expect(input().getAttribute("autocomplete")).toBe("off");
    expect(document.querySelector(".command-listbox").getAttribute("role")).toBe("listbox");
    expect(opts().map((o) => o.getAttribute("role"))).toEqual(["option", "option", "option"]);
  });
  it("typing filters the results", async () => {
    await mount("command"); await label();
    await type("open");
    expect(opts().map((o) => o.hidden)).toEqual([false, false, true]);
    await type("save");
    expect(opts().map((o) => o.hidden)).toEqual([true, true, false]);
  });
  it("arrows move the active result among the visible ones, wrapping", async () => {
    await mount("command"); await label();
    await type("open");
    await press(input(), "ArrowDown");
    expect(input().getAttribute("aria-activedescendant")).toBe(opts()[0].id);
    await press(input(), "ArrowDown");
    expect(input().getAttribute("aria-activedescendant")).toBe(opts()[1].id);
    await press(input(), "ArrowDown");
    expect(input().getAttribute("aria-activedescendant")).toBe(opts()[0].id);
    expect(opts()[0].getAttribute("aria-selected")).toBe("true");
  });
  it("Enter activates the active result with a click", async () => {
    await mount("command"); await label();
    const clicked = vi.fn();
    opts()[1].addEventListener("click", clicked);
    await press(input(), "ArrowDown");
    await press(input(), "ArrowDown");
    await press(input(), "Enter");
    expect(clicked).toHaveBeenCalledTimes(1);
  });
});

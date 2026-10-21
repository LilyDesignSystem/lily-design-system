// tag-input.test.js
// TagInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.tag-input");
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};
const type = async (field, text) => {
  field.value = text;
  field.dispatchEvent(new Event("input", { bubbles: true }));
  await tick();
};
const field = () => el().querySelector("input");
const tags = () => [...el().querySelectorAll(".tag-input-tag span")].map((s) => s.textContent);
const add = async (text) => { field().value = text; await press(field(), "Enter"); };

describe("TagInput", () => {
  it("renders the element with its base class", async () => {
    await mount("tag-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tag-input")).toBe(true);
  });

  it("starts with no tags", async () => {
    await mount("tag-input");
    expect(tags()).toEqual([]);
  });
  it("Enter adds the trimmed text, clears the field and announces it", async () => {
    await mount("tag-input");
    const seen = vi.fn();
    el().addEventListener("lily:add", (e) => seen(e.detail));
    await add("  red  ");
    expect(tags()).toEqual(["red"]);
    expect(field().value).toBe("");
    expect(seen).toHaveBeenCalledWith({ value: "red", tags: ["red"] });
  });
  it("ignores blank text and duplicates, and does not submit a form", async () => {
    await mount("tag-input");
    const added = vi.fn();
    el().addEventListener("lily:add", added);
    await add("   ");
    await add("red");
    await add("red");
    expect(tags()).toEqual(["red"]);
    expect(added).toHaveBeenCalledTimes(1);
    field().value = "blue";
    const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true });
    field().dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });
  it("Backspace on an empty field removes the last tag; a remove button removes its own", async () => {
    await mount("tag-input");
    await add("red"); await add("green"); await add("blue");
    await press(field(), "Backspace");
    expect(tags()).toEqual(["red", "green"]);
    el().querySelectorAll(".tag-input-remove")[0].click(); await tick();
    expect(tags()).toEqual(["green"]);
  });
});

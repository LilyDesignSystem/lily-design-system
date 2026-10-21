// data-filter-form.test.js
// DataFilterForm component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("form.data-filter-form");


describe("DataFilterForm", () => {
  it("renders the element with its base class", async () => {
    await mount("data-filter-form");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("data-filter-form")).toBe(true);
  });

  it("is a search landmark form", async () => {
    await mount("data-filter-form");
    expect(el().getAttribute("role")).toBe("search");
  });
  it("submit never navigates; it announces the field values", async () => {
    await mount("data-filter-form");
    const seen = vi.fn();
    el().addEventListener("lily:filter", (e) => seen(e.detail));
    el().querySelector("input").value = "tea";
    const event = new Event("submit", { bubbles: true, cancelable: true });
    el().dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(seen).toHaveBeenCalledWith({ values: { q: "tea" } });
  });
  it("reset announces lily:reset and clears the fields", async () => {
    await mount("data-filter-form");
    const seen = vi.fn();
    el().addEventListener("lily:reset", seen);
    el().querySelector("input").value = "tea";
    el().reset(); await tick();
    expect(seen).toHaveBeenCalled();
    expect(el().querySelector("input").value).toBe("");
  });
});

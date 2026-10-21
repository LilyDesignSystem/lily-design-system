// tab-bar.test.js
// TabBar component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.tab-bar");
const tabs = () => [...document.querySelectorAll(".tab-bar-button")];
const panels = () => [...document.querySelectorAll(".tab-panel")];

describe("TabBar", () => {
  it("renders the element with its base class", async () => {
    await mount("tab-bar");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tab-bar")).toBe(true);
  });

  it("is a tablist with one tabbable tab", async () => {
    await mount("tab-bar");
    expect(el().getAttribute("role")).toBe("tablist");
    expect(tabs().map((t) => t.getAttribute("tabindex"))).toEqual(["0", "-1", "-1"]);
    expect(tabs().map((t) => t.getAttribute("aria-selected"))).toEqual(["true", "false", "false"]);
  });
  it("shows only the selected panel, linked both ways", async () => {
    await mount("tab-bar");
    expect(panels().map((p) => p.hidden)).toEqual([false, true, true]);
    expect(tabs()[0].getAttribute("aria-controls")).toBe(panels()[0].id);
    expect(panels()[0].getAttribute("aria-labelledby")).toBe(tabs()[0].id);
  });
  it("selects on click", async () => {
    await mount("tab-bar");
    tabs()[1].click(); await tick();
    expect(tabs()[1].getAttribute("aria-selected")).toBe("true");
    expect(panels().map((p) => p.hidden)).toEqual([true, false, true]);
  });
  it("moves with arrow keys, wrapping, and Home/End", async () => {
    await mount("tab-bar");
    const press = async (key) => {
      document.activeElement.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
      await tick();
    };
    tabs()[0].focus();
    await press("ArrowLeft");
    expect(document.activeElement).toBe(tabs()[2]);
    expect(tabs()[2].getAttribute("aria-selected")).toBe("true");
    await press("ArrowRight");
    expect(document.activeElement).toBe(tabs()[0]);
    await press("End");
    expect(document.activeElement).toBe(tabs()[2]);
    await press("Home");
    expect(document.activeElement).toBe(tabs()[0]);
  });
});

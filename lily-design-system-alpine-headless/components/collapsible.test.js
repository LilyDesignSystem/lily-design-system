// collapsible.test.js
// Collapsible component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.collapsible");
const trigger = () => document.querySelector(".collapsible-trigger");
const content = () => document.querySelector(".collapsible-content");

describe("Collapsible", () => {
  it("renders the element with its base class", async () => {
    await mount("collapsible");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("collapsible")).toBe(true);
  });

  it("starts collapsed with hidden content", async () => {
    await mount("collapsible");
    expect(trigger().getAttribute("aria-expanded")).toBe("false");
    expect(content().hidden).toBe(true);
    expect(el().getAttribute("data-expanded")).toBe("false");
  });
  it("expands and collapses", async () => {
    await mount("collapsible");
    trigger().click(); await tick();
    expect(trigger().getAttribute("aria-expanded")).toBe("true");
    expect(content().hidden).toBe(false);
    trigger().click(); await tick();
    expect(content().hidden).toBe(true);
  });
  it("the trigger controls the content", async () => {
    await mount("collapsible");
    expect(trigger().getAttribute("aria-controls")).toBe(content().id);
  });
});

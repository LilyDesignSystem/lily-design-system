// tab-panel.test.js
// TabPanel component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.tab-panel");


describe("TabPanel", () => {
  it("renders the element with its base class", async () => {
    await mount("tab-panel");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("tab-panel")).toBe(true);
  });

  it('is role="tabpanel", visible only when selected', async () => {
    await mount("tab-panel");
    const [a, b] = [...document.querySelectorAll(".tab-panel")];
    expect(a.getAttribute("role")).toBe("tabpanel");
    expect(a.hidden).toBe(false);
    expect(a.getAttribute("data-selected")).toBe("true");
    expect(b.hidden).toBe(true);
    expect(b.getAttribute("data-selected")).toBe("false");
  });
});

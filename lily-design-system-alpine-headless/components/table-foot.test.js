// table-foot.test.js
// TableFoot component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.table-foot");


describe("TableFoot", () => {
  it("renders the element with its base class", async () => {
    await mount("table-foot");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("table-foot")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("table-foot");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});

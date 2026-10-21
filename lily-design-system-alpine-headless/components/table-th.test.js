// table-th.test.js
// TableTH component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("th.table-th");


describe("TableTH", () => {
  it("renders the element with its base class", async () => {
    await mount("table-th");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("table-th")).toBe(true);
  });

  it("uses the th element", async () => {
    await mount("table-th");
    expect(el().tagName.toLowerCase()).toBe("th");
  });
});

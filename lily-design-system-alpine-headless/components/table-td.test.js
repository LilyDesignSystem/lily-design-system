// table-td.test.js
// TableTD component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.table-td");


describe("TableTD", () => {
  it("renders the element with its base class", async () => {
    await mount("table-td");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("table-td")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("table-td");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});

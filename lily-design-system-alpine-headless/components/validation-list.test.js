// validation-list.test.js
// ValidationList component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("ul.validation-list");


describe("ValidationList", () => {
  it("renders the element with its base class", async () => {
    await mount("validation-list");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("validation-list")).toBe(true);
  });

  it("uses the ul element", async () => {
    await mount("validation-list");
    expect(el().tagName.toLowerCase()).toBe("ul");
  });
});

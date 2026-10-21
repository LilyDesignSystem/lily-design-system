// validation-list-item.test.js
// ValidationListItem component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("li.validation-list-item");


describe("ValidationListItem", () => {
  it("renders the element with its base class", async () => {
    await mount("validation-list-item");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("validation-list-item")).toBe(true);
  });

  it("uses the li element", async () => {
    await mount("validation-list-item");
    expect(el().tagName.toLowerCase()).toBe("li");
  });
});

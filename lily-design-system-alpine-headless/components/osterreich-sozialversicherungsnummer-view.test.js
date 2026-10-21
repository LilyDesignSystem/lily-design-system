// osterreich-sozialversicherungsnummer-view.test.js
// OsterreichSozialversicherungsnummerView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.osterreich-sozialversicherungsnummer-view");


describe("OsterreichSozialversicherungsnummerView", () => {
  it("renders the element with its base class", async () => {
    await mount("osterreich-sozialversicherungsnummer-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("osterreich-sozialversicherungsnummer-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("osterreich-sozialversicherungsnummer-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

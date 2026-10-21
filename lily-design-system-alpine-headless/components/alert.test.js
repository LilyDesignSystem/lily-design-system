// alert.test.js
// Alert component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.alert");


describe("Alert", () => {
  it("renders the element with its base class", async () => {
    await mount("alert");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("alert")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("alert");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});

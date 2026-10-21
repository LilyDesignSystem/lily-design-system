// go-to-top.test.js
// GoToTop component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("a.go-to-top");


describe("GoToTop", () => {
  it("renders the element with its base class", async () => {
    await mount("go-to-top");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("go-to-top")).toBe(true);
  });

  it("uses the a element", async () => {
    await mount("go-to-top");
    expect(el().tagName.toLowerCase()).toBe("a");
  });
});

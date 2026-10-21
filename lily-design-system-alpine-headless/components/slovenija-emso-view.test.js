// slovenija-emso-view.test.js
// SlovenijaEmsoView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.slovenija-emso-view");


describe("SlovenijaEmsoView", () => {
  it("renders the element with its base class", async () => {
    await mount("slovenija-emso-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("slovenija-emso-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("slovenija-emso-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

// information-callout.test.js
// InformationCallout component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.information-callout");


describe("InformationCallout", () => {
  it("renders the element with its base class", async () => {
    await mount("information-callout");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("information-callout")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("information-callout");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});

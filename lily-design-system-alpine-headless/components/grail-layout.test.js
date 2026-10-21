// grail-layout.test.js
// GrailLayout component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.grail-layout");


describe("GrailLayout", () => {
  it("renders the element with its base class", async () => {
    await mount("grail-layout");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("grail-layout")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("grail-layout");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});

// nederland-identiteitskaart-nummer-input.test.js
// NederlandIdentiteitskaartNummerInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.nederland-identiteitskaart-nummer-input");


describe("NederlandIdentiteitskaartNummerInput", () => {
  it("renders the element with its base class", async () => {
    await mount("nederland-identiteitskaart-nummer-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("nederland-identiteitskaart-nummer-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("nederland-identiteitskaart-nummer-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

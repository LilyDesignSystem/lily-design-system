// nederland-paspoort-nummer-input.test.js
// NederlandPaspoortNummerInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.nederland-paspoort-nummer-input");


describe("NederlandPaspoortNummerInput", () => {
  it("renders the element with its base class", async () => {
    await mount("nederland-paspoort-nummer-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("nederland-paspoort-nummer-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("nederland-paspoort-nummer-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

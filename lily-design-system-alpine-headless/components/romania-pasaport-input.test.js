// romania-pasaport-input.test.js
// RomaniaPasaportInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.romania-pasaport-input");


describe("RomaniaPasaportInput", () => {
  it("renders the element with its base class", async () => {
    await mount("romania-pasaport-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("romania-pasaport-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("romania-pasaport-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

// cesko-rodne-cislo-input.test.js
// CeskoRodneCisloInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.cesko-rodne-cislo-input");


describe("CeskoRodneCisloInput", () => {
  it("renders the element with its base class", async () => {
    await mount("cesko-rodne-cislo-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("cesko-rodne-cislo-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("cesko-rodne-cislo-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

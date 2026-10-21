// slovensko-rodne-cislo-input.test.js
// SlovenskoRodneCisloInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.slovensko-rodne-cislo-input");


describe("SlovenskoRodneCisloInput", () => {
  it("renders the element with its base class", async () => {
    await mount("slovensko-rodne-cislo-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("slovensko-rodne-cislo-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("slovensko-rodne-cislo-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

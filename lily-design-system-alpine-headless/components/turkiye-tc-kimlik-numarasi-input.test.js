// turkiye-tc-kimlik-numarasi-input.test.js
// TurkiyeTcKimlikNumarasiInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.turkiye-tc-kimlik-numarasi-input");


describe("TurkiyeTcKimlikNumarasiInput", () => {
  it("renders the element with its base class", async () => {
    await mount("turkiye-tc-kimlik-numarasi-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("turkiye-tc-kimlik-numarasi-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("turkiye-tc-kimlik-numarasi-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

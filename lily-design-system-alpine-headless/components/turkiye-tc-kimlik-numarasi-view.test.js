// turkiye-tc-kimlik-numarasi-view.test.js
// TurkiyeTcKimlikNumarasiView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.turkiye-tc-kimlik-numarasi-view");


describe("TurkiyeTcKimlikNumarasiView", () => {
  it("renders the element with its base class", async () => {
    await mount("turkiye-tc-kimlik-numarasi-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("turkiye-tc-kimlik-numarasi-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("turkiye-tc-kimlik-numarasi-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

// cesko-rodne-cislo-view.test.js
// CeskoRodneCisloView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.cesko-rodne-cislo-view");


describe("CeskoRodneCisloView", () => {
  it("renders the element with its base class", async () => {
    await mount("cesko-rodne-cislo-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("cesko-rodne-cislo-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("cesko-rodne-cislo-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

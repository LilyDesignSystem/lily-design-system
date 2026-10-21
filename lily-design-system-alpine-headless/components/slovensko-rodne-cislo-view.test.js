// slovensko-rodne-cislo-view.test.js
// SlovenskoRodneCisloView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.slovensko-rodne-cislo-view");


describe("SlovenskoRodneCisloView", () => {
  it("renders the element with its base class", async () => {
    await mount("slovensko-rodne-cislo-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("slovensko-rodne-cislo-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("slovensko-rodne-cislo-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

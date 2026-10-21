// romania-pasaport-view.test.js
// RomaniaPasaportView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.romania-pasaport-view");


describe("RomaniaPasaportView", () => {
  it("renders the element with its base class", async () => {
    await mount("romania-pasaport-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("romania-pasaport-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("romania-pasaport-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

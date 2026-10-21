// nederland-paspoort-nummer-view.test.js
// NederlandPaspoortNummerView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.nederland-paspoort-nummer-view");


describe("NederlandPaspoortNummerView", () => {
  it("renders the element with its base class", async () => {
    await mount("nederland-paspoort-nummer-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("nederland-paspoort-nummer-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("nederland-paspoort-nummer-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

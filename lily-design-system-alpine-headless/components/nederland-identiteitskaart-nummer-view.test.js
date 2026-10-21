// nederland-identiteitskaart-nummer-view.test.js
// NederlandIdentiteitskaartNummerView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.nederland-identiteitskaart-nummer-view");


describe("NederlandIdentiteitskaartNummerView", () => {
  it("renders the element with its base class", async () => {
    await mount("nederland-identiteitskaart-nummer-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("nederland-identiteitskaart-nummer-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("nederland-identiteitskaart-nummer-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

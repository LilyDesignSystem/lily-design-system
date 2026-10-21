// latvija-personas-kods-view.test.js
// LatvijaPersonasKodsView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.latvija-personas-kods-view");


describe("LatvijaPersonasKodsView", () => {
  it("renders the element with its base class", async () => {
    await mount("latvija-personas-kods-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("latvija-personas-kods-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("latvija-personas-kods-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

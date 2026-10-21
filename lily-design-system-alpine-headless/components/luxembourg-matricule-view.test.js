// luxembourg-matricule-view.test.js
// LuxembourgMatriculeView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.luxembourg-matricule-view");


describe("LuxembourgMatriculeView", () => {
  it("renders the element with its base class", async () => {
    await mount("luxembourg-matricule-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("luxembourg-matricule-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("luxembourg-matricule-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

// lietuva-pasas-view.test.js
// LietuvaPasasView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.lietuva-pasas-view");


describe("LietuvaPasasView", () => {
  it("renders the element with its base class", async () => {
    await mount("lietuva-pasas-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("lietuva-pasas-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("lietuva-pasas-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

// chile-rol-unico-nacional-view.test.js
// ChileRolUnicoNacionalView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.chile-rol-unico-nacional-view");


describe("ChileRolUnicoNacionalView", () => {
  it("renders the element with its base class", async () => {
    await mount("chile-rol-unico-nacional-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("chile-rol-unico-nacional-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("chile-rol-unico-nacional-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

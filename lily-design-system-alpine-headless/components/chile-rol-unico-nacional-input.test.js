// chile-rol-unico-nacional-input.test.js
// ChileRolUnicoNacionalInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.chile-rol-unico-nacional-input");


describe("ChileRolUnicoNacionalInput", () => {
  it("renders the element with its base class", async () => {
    await mount("chile-rol-unico-nacional-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("chile-rol-unico-nacional-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("chile-rol-unico-nacional-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

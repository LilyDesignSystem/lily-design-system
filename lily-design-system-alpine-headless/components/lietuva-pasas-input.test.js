// lietuva-pasas-input.test.js
// LietuvaPasasInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.lietuva-pasas-input");


describe("LietuvaPasasInput", () => {
  it("renders the element with its base class", async () => {
    await mount("lietuva-pasas-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("lietuva-pasas-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("lietuva-pasas-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

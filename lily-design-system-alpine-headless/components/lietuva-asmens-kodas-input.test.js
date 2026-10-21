// lietuva-asmens-kodas-input.test.js
// LietuvaAsmensKodasInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.lietuva-asmens-kodas-input");


describe("LietuvaAsmensKodasInput", () => {
  it("renders the element with its base class", async () => {
    await mount("lietuva-asmens-kodas-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("lietuva-asmens-kodas-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("lietuva-asmens-kodas-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

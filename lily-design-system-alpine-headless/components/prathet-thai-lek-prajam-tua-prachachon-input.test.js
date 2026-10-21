// prathet-thai-lek-prajam-tua-prachachon-input.test.js
// PrathetThaiLekPrajamTuaPrachachonInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.prathet-thai-lek-prajam-tua-prachachon-input");


describe("PrathetThaiLekPrajamTuaPrachachonInput", () => {
  it("renders the element with its base class", async () => {
    await mount("prathet-thai-lek-prajam-tua-prachachon-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("prathet-thai-lek-prajam-tua-prachachon-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("prathet-thai-lek-prajam-tua-prachachon-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

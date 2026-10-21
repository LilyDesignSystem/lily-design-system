// espana-tarjeta-sanitaria-individual-input.test.js
// EspanaTarjetaSanitariaIndividualInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.espana-tarjeta-sanitaria-individual-input");


describe("EspanaTarjetaSanitariaIndividualInput", () => {
  it("renders the element with its base class", async () => {
    await mount("espana-tarjeta-sanitaria-individual-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("espana-tarjeta-sanitaria-individual-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("espana-tarjeta-sanitaria-individual-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

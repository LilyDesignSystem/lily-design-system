// espana-tarjeta-sanitaria-individual-view.test.js
// EspanaTarjetaSanitariaIndividualView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.espana-tarjeta-sanitaria-individual-view");


describe("EspanaTarjetaSanitariaIndividualView", () => {
  it("renders the element with its base class", async () => {
    await mount("espana-tarjeta-sanitaria-individual-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("espana-tarjeta-sanitaria-individual-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("espana-tarjeta-sanitaria-individual-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

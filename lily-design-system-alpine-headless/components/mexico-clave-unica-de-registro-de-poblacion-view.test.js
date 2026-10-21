// mexico-clave-unica-de-registro-de-poblacion-view.test.js
// MexicoClaveUnicaDeRegistroDePoblacionView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.mexico-clave-unica-de-registro-de-poblacion-view");


describe("MexicoClaveUnicaDeRegistroDePoblacionView", () => {
  it("renders the element with its base class", async () => {
    await mount("mexico-clave-unica-de-registro-de-poblacion-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("mexico-clave-unica-de-registro-de-poblacion-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("mexico-clave-unica-de-registro-de-poblacion-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

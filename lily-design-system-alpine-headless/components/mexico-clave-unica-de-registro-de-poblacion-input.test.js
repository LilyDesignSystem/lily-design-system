// mexico-clave-unica-de-registro-de-poblacion-input.test.js
// MexicoClaveUnicaDeRegistroDePoblacionInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.mexico-clave-unica-de-registro-de-poblacion-input");


describe("MexicoClaveUnicaDeRegistroDePoblacionInput", () => {
  it("renders the element with its base class", async () => {
    await mount("mexico-clave-unica-de-registro-de-poblacion-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("mexico-clave-unica-de-registro-de-poblacion-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("mexico-clave-unica-de-registro-de-poblacion-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

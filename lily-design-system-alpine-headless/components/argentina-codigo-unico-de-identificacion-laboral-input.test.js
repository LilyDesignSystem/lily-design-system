// argentina-codigo-unico-de-identificacion-laboral-input.test.js
// ArgentinaCodigoUnicoDeIdentificacionLaboralInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.argentina-codigo-unico-de-identificacion-laboral-input");


describe("ArgentinaCodigoUnicoDeIdentificacionLaboralInput", () => {
  it("renders the element with its base class", async () => {
    await mount("argentina-codigo-unico-de-identificacion-laboral-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("argentina-codigo-unico-de-identificacion-laboral-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("argentina-codigo-unico-de-identificacion-laboral-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

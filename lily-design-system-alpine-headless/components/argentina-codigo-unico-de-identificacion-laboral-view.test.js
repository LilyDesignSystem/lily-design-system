// argentina-codigo-unico-de-identificacion-laboral-view.test.js
// ArgentinaCodigoUnicoDeIdentificacionLaboralView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.argentina-codigo-unico-de-identificacion-laboral-view");


describe("ArgentinaCodigoUnicoDeIdentificacionLaboralView", () => {
  it("renders the element with its base class", async () => {
    await mount("argentina-codigo-unico-de-identificacion-laboral-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("argentina-codigo-unico-de-identificacion-laboral-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("argentina-codigo-unico-de-identificacion-laboral-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

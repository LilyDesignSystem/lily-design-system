// espana-codigo-de-identificacion-fiscal-view.test.js
// EspanaCodigoDeIdentificacionFiscalView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.espana-codigo-de-identificacion-fiscal-view");


describe("EspanaCodigoDeIdentificacionFiscalView", () => {
  it("renders the element with its base class", async () => {
    await mount("espana-codigo-de-identificacion-fiscal-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("espana-codigo-de-identificacion-fiscal-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("espana-codigo-de-identificacion-fiscal-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

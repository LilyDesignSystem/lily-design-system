// espana-codigo-de-identificacion-fiscal-input.test.js
// EspanaCodigoDeIdentificacionFiscalInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.espana-codigo-de-identificacion-fiscal-input");


describe("EspanaCodigoDeIdentificacionFiscalInput", () => {
  it("renders the element with its base class", async () => {
    await mount("espana-codigo-de-identificacion-fiscal-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("espana-codigo-de-identificacion-fiscal-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("espana-codigo-de-identificacion-fiscal-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

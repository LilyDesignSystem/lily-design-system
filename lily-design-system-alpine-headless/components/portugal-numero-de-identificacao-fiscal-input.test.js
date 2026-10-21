// portugal-numero-de-identificacao-fiscal-input.test.js
// PortugalNumeroDeIdentificacaoFiscalInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.portugal-numero-de-identificacao-fiscal-input");


describe("PortugalNumeroDeIdentificacaoFiscalInput", () => {
  it("renders the element with its base class", async () => {
    await mount("portugal-numero-de-identificacao-fiscal-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("portugal-numero-de-identificacao-fiscal-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("portugal-numero-de-identificacao-fiscal-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

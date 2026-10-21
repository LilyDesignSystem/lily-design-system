// portugal-numero-de-identificacao-fiscal-view.test.js
// PortugalNumeroDeIdentificacaoFiscalView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.portugal-numero-de-identificacao-fiscal-view");


describe("PortugalNumeroDeIdentificacaoFiscalView", () => {
  it("renders the element with its base class", async () => {
    await mount("portugal-numero-de-identificacao-fiscal-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("portugal-numero-de-identificacao-fiscal-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("portugal-numero-de-identificacao-fiscal-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

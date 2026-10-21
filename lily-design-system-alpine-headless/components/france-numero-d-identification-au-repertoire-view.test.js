// france-numero-d-identification-au-repertoire-view.test.js
// FranceNumeroDIdentificationAuRepertoireView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.france-numero-d-identification-au-repertoire-view");


describe("FranceNumeroDIdentificationAuRepertoireView", () => {
  it("renders the element with its base class", async () => {
    await mount("france-numero-d-identification-au-repertoire-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("france-numero-d-identification-au-repertoire-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("france-numero-d-identification-au-repertoire-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

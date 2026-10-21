// france-numero-d-identification-au-repertoire-input.test.js
// FranceNumeroDIdentificationAuRepertoireInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.france-numero-d-identification-au-repertoire-input");


describe("FranceNumeroDIdentificationAuRepertoireInput", () => {
  it("renders the element with its base class", async () => {
    await mount("france-numero-d-identification-au-repertoire-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("france-numero-d-identification-au-repertoire-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("france-numero-d-identification-au-repertoire-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

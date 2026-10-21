// eire-individual-health-identifier-input.test.js
// EireIndividualHealthIdentifierInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.eire-individual-health-identifier-input");


describe("EireIndividualHealthIdentifierInput", () => {
  it("renders the element with its base class", async () => {
    await mount("eire-individual-health-identifier-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("eire-individual-health-identifier-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("eire-individual-health-identifier-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

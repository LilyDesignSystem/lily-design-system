// australia-individual-healthcare-identifier-input.test.js
// AustraliaIndividualHealthcareIdentifierInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.australia-individual-healthcare-identifier-input");


describe("AustraliaIndividualHealthcareIdentifierInput", () => {
  it("renders the element with its base class", async () => {
    await mount("australia-individual-healthcare-identifier-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("australia-individual-healthcare-identifier-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("australia-individual-healthcare-identifier-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

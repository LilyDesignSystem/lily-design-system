// australia-individual-healthcare-identifier-view.test.js
// AustraliaIndividualHealthcareIdentifierView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.australia-individual-healthcare-identifier-view");


describe("AustraliaIndividualHealthcareIdentifierView", () => {
  it("renders the element with its base class", async () => {
    await mount("australia-individual-healthcare-identifier-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("australia-individual-healthcare-identifier-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("australia-individual-healthcare-identifier-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

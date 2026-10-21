// eire-individual-health-identifier-view.test.js
// EireIndividualHealthIdentifierView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.eire-individual-health-identifier-view");


describe("EireIndividualHealthIdentifierView", () => {
  it("renders the element with its base class", async () => {
    await mount("eire-individual-health-identifier-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("eire-individual-health-identifier-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("eire-individual-health-identifier-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

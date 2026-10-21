// luxembourg-matricule-input.test.js
// LuxembourgMatriculeInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.luxembourg-matricule-input");


describe("LuxembourgMatriculeInput", () => {
  it("renders the element with its base class", async () => {
    await mount("luxembourg-matricule-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("luxembourg-matricule-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("luxembourg-matricule-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

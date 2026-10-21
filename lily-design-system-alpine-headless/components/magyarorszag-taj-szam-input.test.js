// magyarorszag-taj-szam-input.test.js
// MagyarorszagTajSzamInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.magyarorszag-taj-szam-input");


describe("MagyarorszagTajSzamInput", () => {
  it("renders the element with its base class", async () => {
    await mount("magyarorszag-taj-szam-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("magyarorszag-taj-szam-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("magyarorszag-taj-szam-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

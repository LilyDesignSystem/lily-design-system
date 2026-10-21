// magyarorszag-taj-szam-view.test.js
// MagyarorszagTajSzamView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.magyarorszag-taj-szam-view");


describe("MagyarorszagTajSzamView", () => {
  it("renders the element with its base class", async () => {
    await mount("magyarorszag-taj-szam-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("magyarorszag-taj-szam-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("magyarorszag-taj-szam-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

// aotearoa-national-health-index-view.test.js
// AotearoaNationalHealthIndexView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.aotearoa-national-health-index-view");


describe("AotearoaNationalHealthIndexView", () => {
  it("renders the element with its base class", async () => {
    await mount("aotearoa-national-health-index-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("aotearoa-national-health-index-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("aotearoa-national-health-index-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

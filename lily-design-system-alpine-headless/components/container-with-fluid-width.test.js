// container-with-fluid-width.test.js
// ContainerWithFluidWidth component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.container-with-fluid-width");


describe("ContainerWithFluidWidth", () => {
  it("renders the element with its base class", async () => {
    await mount("container-with-fluid-width");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("container-with-fluid-width")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("container-with-fluid-width");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});

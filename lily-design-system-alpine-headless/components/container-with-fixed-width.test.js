// container-with-fixed-width.test.js
// ContainerWithFixedWidth component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.container-with-fixed-width");


describe("ContainerWithFixedWidth", () => {
  it("renders the element with its base class", async () => {
    await mount("container-with-fixed-width");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("container-with-fixed-width")).toBe(true);
  });

  it("uses the div element", async () => {
    await mount("container-with-fixed-width");
    expect(el().tagName.toLowerCase()).toBe("div");
  });
});

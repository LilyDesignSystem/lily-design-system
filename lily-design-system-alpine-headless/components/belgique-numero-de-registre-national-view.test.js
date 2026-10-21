// belgique-numero-de-registre-national-view.test.js
// BelgiqueNumeroDeRegistreNationalView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.belgique-numero-de-registre-national-view");


describe("BelgiqueNumeroDeRegistreNationalView", () => {
  it("renders the element with its base class", async () => {
    await mount("belgique-numero-de-registre-national-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("belgique-numero-de-registre-national-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("belgique-numero-de-registre-national-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

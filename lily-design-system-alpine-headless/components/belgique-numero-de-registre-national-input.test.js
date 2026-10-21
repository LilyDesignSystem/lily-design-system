// belgique-numero-de-registre-national-input.test.js
// BelgiqueNumeroDeRegistreNationalInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.belgique-numero-de-registre-national-input");


describe("BelgiqueNumeroDeRegistreNationalInput", () => {
  it("renders the element with its base class", async () => {
    await mount("belgique-numero-de-registre-national-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("belgique-numero-de-registre-national-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("belgique-numero-de-registre-national-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

// indonesia-nomor-induk-kependudukan-input.test.js
// IndonesiaNomorIndukKependudukanInput component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("input.indonesia-nomor-induk-kependudukan-input");


describe("IndonesiaNomorIndukKependudukanInput", () => {
  it("renders the element with its base class", async () => {
    await mount("indonesia-nomor-induk-kependudukan-input");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("indonesia-nomor-induk-kependudukan-input")).toBe(true);
  });

  it("uses the input element", async () => {
    await mount("indonesia-nomor-induk-kependudukan-input");
    expect(el().tagName.toLowerCase()).toBe("input");
  });
});

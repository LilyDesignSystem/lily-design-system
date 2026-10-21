// indonesia-nomor-induk-kependudukan-view.test.js
// IndonesiaNomorIndukKependudukanView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.indonesia-nomor-induk-kependudukan-view");


describe("IndonesiaNomorIndukKependudukanView", () => {
  it("renders the element with its base class", async () => {
    await mount("indonesia-nomor-induk-kependudukan-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("indonesia-nomor-induk-kependudukan-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("indonesia-nomor-induk-kependudukan-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

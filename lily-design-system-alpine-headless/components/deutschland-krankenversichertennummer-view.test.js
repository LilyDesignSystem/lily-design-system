// deutschland-krankenversichertennummer-view.test.js
// DeutschlandKrankenversichertennummerView component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("span.deutschland-krankenversichertennummer-view");


describe("DeutschlandKrankenversichertennummerView", () => {
  it("renders the element with its base class", async () => {
    await mount("deutschland-krankenversichertennummer-view");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("deutschland-krankenversichertennummer-view")).toBe(true);
  });

  it("uses the span element", async () => {
    await mount("deutschland-krankenversichertennummer-view");
    expect(el().tagName.toLowerCase()).toBe("span");
  });
});

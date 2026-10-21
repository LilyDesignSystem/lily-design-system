// red-amber-green-picker.test.js
// RedAmberGreenPicker component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("select.red-amber-green-picker");


describe("RedAmberGreenPicker", () => {
  it("renders the element with its base class", async () => {
    await mount("red-amber-green-picker");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("red-amber-green-picker")).toBe(true);
  });

  it("offers 3 options, the first selected", async () => {
    await mount("red-amber-green-picker");
    expect([...el().options].map((o) => o.value)).toEqual(["red","amber","green"]);
    expect(el().value).toBe("red");
    expect(el().getAttribute("data-value")).toBe("red");
  });
  it("choosing an option updates data-value", async () => {
    await mount("red-amber-green-picker");
    el().value = "green";
    el().dispatchEvent(new Event("change", { bubbles: true })); await tick();
    expect(el().getAttribute("data-value")).toBe("green");
  });
});

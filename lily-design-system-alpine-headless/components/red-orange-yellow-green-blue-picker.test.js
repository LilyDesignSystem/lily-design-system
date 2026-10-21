// red-orange-yellow-green-blue-picker.test.js
// RedOrangeYellowGreenBluePicker component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("select.red-orange-yellow-green-blue-picker");


describe("RedOrangeYellowGreenBluePicker", () => {
  it("renders the element with its base class", async () => {
    await mount("red-orange-yellow-green-blue-picker");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("red-orange-yellow-green-blue-picker")).toBe(true);
  });

  it("offers 5 options, the first selected", async () => {
    await mount("red-orange-yellow-green-blue-picker");
    expect([...el().options].map((o) => o.value)).toEqual(["red","orange","yellow","green","blue"]);
    expect(el().value).toBe("red");
    expect(el().getAttribute("data-value")).toBe("red");
  });
  it("choosing an option updates data-value", async () => {
    await mount("red-orange-yellow-green-blue-picker");
    el().value = "yellow";
    el().dispatchEvent(new Event("change", { bubbles: true })); await tick();
    expect(el().getAttribute("data-value")).toBe("yellow");
  });
});

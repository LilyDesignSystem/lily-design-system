// color-picker.test.js
// ColorPicker component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.color-picker");
import { snippet } from "../test/mount.js";
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};

describe("ColorPicker", () => {
  it("renders the element with its base class", async () => {
    await mount("color-picker");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("color-picker")).toBe(true);
  });

  it('is role="slider" on a 0 to 100 range, focusable', async () => {
    await mount("color-picker");
    expect(el().getAttribute("role")).toBe("slider");
    expect(["aria-valuenow", "aria-valuemin", "aria-valuemax"].map((a) => el().getAttribute(a))).toEqual(["0", "0", "100"]);
    expect(el().getAttribute("tabindex")).toBe("0");
    expect([el().dataset.x, el().dataset.y]).toEqual(["0", "0"]);
  });
  it("Right/Left move x and Down/Up move y, Shift by ten", async () => {
    await mount("color-picker");
    await press(el(), "ArrowRight");
    await press(el(), "ArrowDown");
    await press(el(), "ArrowDown", { shiftKey: true });
    expect([el().dataset.x, el().dataset.y]).toEqual(["1", "11"]);
    expect(el().getAttribute("aria-valuenow")).toBe("1");
    await press(el(), "ArrowUp");
    await press(el(), "ArrowLeft", { shiftKey: true });
    expect([el().dataset.x, el().dataset.y]).toEqual(["0", "10"]);
  });
  it("stays inside 0 to 100; Home and End set x", async () => {
    await mount("color-picker");
    await press(el(), "ArrowUp");
    await press(el(), "ArrowLeft");
    expect([el().dataset.x, el().dataset.y]).toEqual(["0", "0"]);
    await press(el(), "End");
    expect(el().dataset.x).toBe("100");
    await press(el(), "ArrowRight");
    expect(el().dataset.x).toBe("100");
    await press(el(), "Home");
    expect(el().dataset.x).toBe("0");
  });
  it("when disabled it is not tabbable and ignores keys", async () => {
    await mount("color-picker", snippet("color-picker").replace("lilyColorPicker(0, 0)", "lilyColorPicker(0, 0, true)"));
    expect(el().getAttribute("tabindex")).toBe("-1");
    expect(el().getAttribute("aria-disabled")).toBe("true");
    await press(el(), "ArrowRight");
    expect(el().dataset.x).toBe("0");
  });
});

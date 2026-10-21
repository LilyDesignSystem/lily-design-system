// dial.test.js
// Dial component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.dial");
import { snippet } from "../test/mount.js";
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};

describe("Dial", () => {
  it("renders the element with its base class", async () => {
    await mount("dial");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("dial")).toBe(true);
  });

  it('is role="slider" reporting value and bounds, focusable', async () => {
    await mount("dial");
    expect(el().getAttribute("role")).toBe("slider");
    expect(["aria-valuenow", "aria-valuemin", "aria-valuemax"].map((a) => el().getAttribute(a))).toEqual(["50", "0", "100"]);
    expect(el().getAttribute("tabindex")).toBe("0");
    expect(el().hasAttribute("aria-disabled")).toBe(false);
  });
  it("Right/Up raise and Left/Down lower by one step", async () => {
    await mount("dial");
    el().focus();
    await press(el(), "ArrowRight");
    expect(el().getAttribute("aria-valuenow")).toBe("51");
    await press(el(), "ArrowUp");
    expect(el().getAttribute("aria-valuenow")).toBe("52");
    await press(el(), "ArrowLeft");
    await press(el(), "ArrowDown");
    expect(el().getAttribute("aria-valuenow")).toBe("50");
  });
  it("Shift moves ten steps and the value stays inside the bounds", async () => {
    await mount("dial");
    await press(el(), "ArrowRight", { shiftKey: true });
    expect(el().getAttribute("aria-valuenow")).toBe("60");
    await press(el(), "ArrowRight", { shiftKey: true }); await press(el(), "ArrowRight", { shiftKey: true });
    await press(el(), "ArrowRight", { shiftKey: true }); await press(el(), "ArrowRight", { shiftKey: true });
    expect(el().getAttribute("aria-valuenow")).toBe("100");
    await press(el(), "ArrowRight");
    expect(el().getAttribute("aria-valuenow")).toBe("100");
  });
  it("Home and End jump to the bounds", async () => {
    await mount("dial");
    await press(el(), "Home");
    expect(el().getAttribute("aria-valuenow")).toBe("0");
    await press(el(), "End");
    expect(el().getAttribute("aria-valuenow")).toBe("100");
  });
  it("announces each change with lily:change", async () => {
    await mount("dial");
    const seen = vi.fn();
    el().addEventListener("lily:change", (e) => seen(e.detail));
    await press(el(), "ArrowRight");
    expect(seen).toHaveBeenCalledWith({ value: 51 });
  });
  it("when disabled it is not tabbable, says so, and ignores keys", async () => {
    await mount("dial", snippet("dial").replace("lilyDial(50, 0, 100, 1)", "lilyDial(50, 0, 100, 1, true)"));
    expect(el().getAttribute("tabindex")).toBe("-1");
    expect(el().getAttribute("aria-disabled")).toBe("true");
    await press(el(), "ArrowRight");
    expect(el().getAttribute("aria-valuenow")).toBe("50");
  });
});

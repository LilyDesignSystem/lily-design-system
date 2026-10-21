// splitter.test.js
// Splitter component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.splitter");
import { snippet } from "../test/mount.js";
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};

describe("Splitter", () => {
  it("renders the element with its base class", async () => {
    await mount("splitter");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("splitter")).toBe(true);
  });

  const parent = () => el().parentElement;
  const rect = (width, height) => { parent().getBoundingClientRect = () => ({ left: 0, top: 0, width, height }); };
  const fire = (type, init) => document.dispatchEvent(new MouseEvent(type, { bubbles: true, ...init }));
  it("is a focusable separator reporting its position and orientation", async () => {
    await mount("splitter");
    expect(el().getAttribute("role")).toBe("separator");
    expect(el().getAttribute("tabindex")).toBe("0");
    expect(el().getAttribute("aria-orientation")).toBe("vertical");
    expect(["aria-valuenow", "aria-valuemin", "aria-valuemax"].map((a) => el().getAttribute(a))).toEqual(["50", "0", "100"]);
    expect(el().style.getPropertyValue("--splitter-position")).toBe("50%");
  });
  it("Left/Right move a side-by-side splitter; Up/Down do nothing", async () => {
    await mount("splitter");
    await press(el(), "ArrowRight");
    expect(el().getAttribute("aria-valuenow")).toBe("51");
    await press(el(), "ArrowLeft", { shiftKey: true });
    expect(el().getAttribute("aria-valuenow")).toBe("41");
    await press(el(), "ArrowUp");
    expect(el().getAttribute("aria-valuenow")).toBe("41");
    expect(el().style.getPropertyValue("--splitter-position")).toBe("41%");
  });
  it("Up/Down move a stacked splitter; Home and End jump", async () => {
    await mount("splitter", snippet("splitter").replace("'vertical'", "'horizontal'"));
    expect(el().getAttribute("aria-orientation")).toBe("horizontal");
    await press(el(), "ArrowDown");
    expect(el().getAttribute("aria-valuenow")).toBe("51");
    await press(el(), "ArrowLeft");
    expect(el().getAttribute("aria-valuenow")).toBe("51");
    await press(el(), "End");
    expect(el().getAttribute("aria-valuenow")).toBe("100");
    await press(el(), "Home");
    expect(el().getAttribute("aria-valuenow")).toBe("0");
  });
  it("dragging maps the pointer onto the parent and stops on release", async () => {
    await mount("splitter");
    rect(200, 100);
    const seen = vi.fn();
    parent().addEventListener("lily:change", (e) => seen(e.detail));
    el().dispatchEvent(new MouseEvent("pointerdown", { bubbles: true, cancelable: true }));
    fire("pointermove", { clientX: 50 }); await tick();
    expect(el().getAttribute("aria-valuenow")).toBe("25");
    fire("pointermove", { clientX: 400 }); await tick();
    expect(el().getAttribute("aria-valuenow")).toBe("100");
    fire("pointerup", {});
    fire("pointermove", { clientX: 20 }); await tick();
    expect(el().getAttribute("aria-valuenow")).toBe("100");
    expect(seen).toHaveBeenCalledWith({ value: 25 });
  });
});

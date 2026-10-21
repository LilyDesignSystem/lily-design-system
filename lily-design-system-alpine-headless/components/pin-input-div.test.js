// pin-input-div.test.js
// PinInputDiv component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.pin-input-div");
const press = async (target, key, init = {}) => {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init }));
  await tick();
};
const type = async (field, text) => {
  field.value = text;
  field.dispatchEvent(new Event("input", { bubbles: true }));
  await tick();
};
const boxes = () => [...el().querySelectorAll("input")];
const paste = (box, text) => {
  const event = new Event("paste", { bubbles: true, cancelable: true });
  event.clipboardData = { getData: () => text };
  box.dispatchEvent(event);
};

describe("PinInputDiv", () => {
  it("renders the element with its base class", async () => {
    await mount("pin-input-div");
    expect(el()).not.toBeNull();
    expect(el().classList.contains("pin-input-div")).toBe(true);
  });

  it("is a group of numeric single-character inputs", async () => {
    await mount("pin-input-div");
    expect(el().getAttribute("role")).toBe("group");
    expect(boxes()).toHaveLength(4);
    expect(boxes().every((b) => b.getAttribute("inputmode") === "numeric" && b.getAttribute("maxlength") === "1")).toBe(true);
  });
  it("a digit fills its box and moves focus on", async () => {
    await mount("pin-input-div");
    boxes()[0].focus();
    await type(boxes()[0], "7");
    expect(boxes()[0].value).toBe("7");
    expect(document.activeElement).toBe(boxes()[1]);
    expect(el().dataset.value).toBe("7");
  });
  it("drops anything that is not a digit", async () => {
    await mount("pin-input-div");
    boxes()[0].focus();
    await type(boxes()[0], "a");
    expect(boxes()[0].value).toBe("");
    expect(document.activeElement).toBe(boxes()[0]);
  });
  it("Backspace on an empty box clears and focuses the previous one; arrows move", async () => {
    await mount("pin-input-div");
    boxes()[0].value = "5";
    boxes()[1].focus();
    await press(boxes()[1], "Backspace");
    expect(boxes()[0].value).toBe("");
    expect(document.activeElement).toBe(boxes()[0]);
    await press(boxes()[0], "ArrowRight");
    expect(document.activeElement).toBe(boxes()[1]);
    await press(boxes()[1], "ArrowLeft");
    expect(document.activeElement).toBe(boxes()[0]);
  });
  it("a paste spreads digits across the boxes and announces completion", async () => {
    await mount("pin-input-div");
    const done = vi.fn();
    el().addEventListener("lily:complete", (e) => done(e.detail));
    paste(boxes()[0], "12-34"); await tick();
    expect(boxes().map((b) => b.value)).toEqual(["1", "2", "3", "4"]);
    expect(done).toHaveBeenCalledWith({ value: "1234" });
    expect(document.activeElement).toBe(boxes()[3]);
  });
});

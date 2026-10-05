import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const opts = [{ value: "a", text: "A" }, { value: "b", text: "B" }, { value: "c", text: "C", disabled: true }];
const r = (p) => render("multi-select", { label: "Pick", options: opts, ...p }).document;

describe("multi-select", () => {
  it("renders a multiple <select>", () => {
    const s = r({}).querySelector("select");
    expect(s.hasAttribute("multiple")).toBe(true);
  });
  it("puts aria-label on the select", () => {
    expect(r({}).querySelector("select").getAttribute("aria-label")).toBe("Pick");
  });
  it("renders option descriptors", () => {
    const o = r({}).querySelectorAll("option");
    expect(o.length).toBe(3);
    expect(o[2].hasAttribute("disabled")).toBe(true);
  });
  it("selects every option whose value is in the value array", () => {
    const o = r({ value: ["a", "b"] }).querySelectorAll("option[selected]");
    expect(Array.from(o).map((x) => x.value)).toEqual(["a", "b"]);
  });
  it("selects nothing by default", () => {
    expect(r({}).querySelectorAll("option[selected]").length).toBe(0);
  });
  it("renders size, required, disabled, name", () => {
    const s = r({ size: 4, required: true, disabled: true, name: "n" }).querySelector("select");
    expect(s.getAttribute("size")).toBe("4");
    expect(s.hasAttribute("required")).toBe(true);
    expect(s.hasAttribute("disabled")).toBe(true);
    expect(s.getAttribute("name")).toBe("n");
  });
  it("renders caller <option> children when no options given", () => {
    const { document } = render("multi-select", { label: "Pick" }, '<option value="z">Z</option>');
    expect(document.querySelector("option").value).toBe("z");
  });
  it("appends classes and spreads attributes", () => {
    const el = r({ classes: "extra", attributes: { "data-x": "1" } }).querySelector(".multi-select");
    expect(el.classList.contains("extra")).toBe(true);
    expect(el.getAttribute("data-x")).toBe("1");
  });
  it("contains no <style> or <script> tags", () => {
    const { html } = render("multi-select", { label: "Pick", options: opts });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
  it("the select itself carries the base class", () => {
    expect(r({}).querySelector("select").classList.contains("multi-select")).toBe(true);
  });
});

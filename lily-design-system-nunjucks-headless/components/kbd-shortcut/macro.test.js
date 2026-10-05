import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const r = (x = {}) => render("kbd-shortcut", { keys: ["Ctrl", "K"], ...x }).document;
describe("kbd-shortcut", () => {
  it("renders a <kbd> root with the base class", () => {
    const el = r().querySelector(".kbd-shortcut");
    expect(el.tagName).toBe("KBD");
  });
  it("renders one inner kbd per key in order", () => {
    const keys = r({ keys: ["Ctrl", "Shift", "P"] }).querySelectorAll("kbd.kbd-shortcut-key");
    expect(Array.from(keys).map((k) => k.textContent)).toEqual(["Ctrl", "Shift", "P"]);
  });
  it("puts a separator between keys only (n-1), default +", () => {
    const seps = r({ keys: ["A", "B", "C"] }).querySelectorAll(".kbd-shortcut-separator");
    expect(seps.length).toBe(2);
    expect(seps[0].textContent).toBe("+");
  });
  it("renders no separator for a single key", () => {
    expect(r({ keys: ["Esc"] }).querySelectorAll(".kbd-shortcut-separator").length).toBe(0);
  });
  it("separators are aria-hidden and the separator is overridable", () => {
    const s = r({ separator: "then" }).querySelector(".kbd-shortcut-separator");
    expect(s.getAttribute("aria-hidden")).toBe("true");
    expect(s.textContent).toBe("then");
  });
  it("label becomes aria-label on the root only when given", () => {
    expect(r({ label: "Control K" }).querySelector(".kbd-shortcut").getAttribute("aria-label")).toBe("Control K");
    expect(r().querySelector(".kbd-shortcut").hasAttribute("aria-label")).toBe(false);
  });
  it("appends classes and spreads attributes on the root", () => {
    const el = r({ classes: "extra", attributes: { "data-x": "1" } }).querySelector(".kbd-shortcut");
    expect(el.classList.contains("extra")).toBe(true);
    expect(el.getAttribute("data-x")).toBe("1");
  });
  it("contains no <style> or <script> tags", () => {
    const { html } = render("kbd-shortcut", { keys: ["A"] });
    expect(html).not.toMatch(/<(style|script)/);
  });
});

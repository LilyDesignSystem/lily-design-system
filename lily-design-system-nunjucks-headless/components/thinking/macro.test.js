import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const r = (x = {}, c = "Reasoning") => render("thinking", { label: "Thinking", ...x }, c).document;
describe("thinking", () => {
  it("renders <details class=thinking> with summary and content", () => {
    const d = r();
    const root = d.querySelector("details.thinking");
    expect(root).toBeTruthy();
    expect(root.querySelector("summary.thinking-summary").textContent).toBe("Thinking");
    expect(root.querySelector("div.thinking-content").textContent.trim()).toBe("Reasoning");
  });
  it("is closed by default and open when open is set", () => {
    expect(r().querySelector("details").hasAttribute("open")).toBe(false);
    expect(r({ open: true }).querySelector("details").hasAttribute("open")).toBe(true);
  });
  it("adds data-streaming and aria-busy only while streaming", () => {
    const on = r({ streaming: true }).querySelector("details");
    expect(on.getAttribute("data-streaming")).toBe("true");
    expect(on.getAttribute("aria-busy")).toBe("true");
    const off = r().querySelector("details");
    expect(off.hasAttribute("data-streaming")).toBe(false);
    expect(off.hasAttribute("aria-busy")).toBe(false);
  });
  it("summary is the first child (native keyboard toggle)", () => {
    expect(r().querySelector("details").firstElementChild.tagName).toBe("SUMMARY");
  });
  it("appends classes and spreads attributes on the root", () => {
    const el = r({ classes: "extra", attributes: { "data-x": "1" } }).querySelector("details");
    expect(el.classList.contains("extra")).toBe(true);
    expect(el.getAttribute("data-x")).toBe("1");
  });
  it("contains no <style> or <script> tags", () => {
    const { html } = render("thinking", { label: "T" });
    expect(html).not.toMatch(/<(style|script)/);
  });
});

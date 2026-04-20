import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("time-picker-input", () => {
  it("renders an <input type=time> with the base class", () => {
    const { document } = render("time-picker-input", { id: "t", value: "09:30" });
    const el = document.querySelector("input.time-picker-input");
    expect(el).toBeTruthy();
    expect(el.getAttribute("type")).toBe("time");
    expect(el.getAttribute("value")).toBe("09:30");
  });

  it("renders a <datalist> when options are provided", () => {
    const { document } = render("time-picker-input", {
      id: "t",
      options: ["09:00", "09:30", "10:00"],
    });
    expect(document.querySelector("input").getAttribute("list")).toBe("t-list");
    const dl = document.querySelector("datalist#t-list");
    expect(dl).toBeTruthy();
    expect(dl.querySelectorAll("option").length).toBe(3);
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("time-picker-input", { id: "t" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});

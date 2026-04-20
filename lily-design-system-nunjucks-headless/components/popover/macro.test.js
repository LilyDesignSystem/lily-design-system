import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("popover", () => {
  it("renders a <div> with the base class", () => {
    const { document } = render("popover", { id: "p" });
    expect(document.querySelector("div.popover")).toBeTruthy();
  });

  it("sets id and default popover='auto'", () => {
    const { document } = render("popover", { id: "info" });
    const el = document.querySelector("div.popover");
    expect(el.getAttribute("id")).toBe("info");
    expect(el.getAttribute("popover")).toBe("auto");
  });

  it("respects a custom popover mode", () => {
    const { document } = render("popover", {
      id: "info",
      popover: "manual",
    });
    expect(document.querySelector("div.popover").getAttribute("popover"))
      .toBe("manual");
  });

  it("sets aria-labelledby or aria-label", () => {
    const { document: a } = render("popover", {
      id: "p",
      labelledBy: "h1",
    });
    expect(a.querySelector("div.popover").getAttribute("aria-labelledby"))
      .toBe("h1");

    const { document: b } = render("popover", { id: "p", label: "Details" });
    expect(b.querySelector("div.popover").getAttribute("aria-label"))
      .toBe("Details");
  });

  it("renders caller block content", () => {
    const { document } = render(
      "popover",
      { id: "p", label: "Details" },
      "<p>Info</p>",
    );
    expect(document.querySelector("div.popover p").textContent).toBe("Info");
  });

  it("appends params.classes", () => {
    const { document } = render("popover", { id: "p", classes: "dark" });
    expect(document.querySelector("div.popover.dark")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("popover", { id: "p" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});

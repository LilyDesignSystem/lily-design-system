import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("alert-dialog", () => {
  it("renders a <dialog role=alertdialog> with the base class", () => {
    const { document } = render("alert-dialog", {});
    const el = document.querySelector("dialog.alert-dialog");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("alertdialog");
  });

  it("sets aria-labelledby and aria-describedby", () => {
    const { document } = render("alert-dialog", {
      id: "a1",
      labelledBy: "a1-title",
      describedBy: "a1-desc",
    });
    const el = document.querySelector("dialog.alert-dialog");
    expect(el.getAttribute("aria-labelledby")).toBe("a1-title");
    expect(el.getAttribute("aria-describedby")).toBe("a1-desc");
  });

  it("sets open attribute when params.open is true", () => {
    const { document } = render("alert-dialog", { open: true });
    expect(document.querySelector("dialog.alert-dialog").hasAttribute("open"))
      .toBe(true);
  });

  it("renders caller block content", () => {
    const { document } = render(
      "alert-dialog",
      { labelledBy: "t" },
      '<h2 id="t">Delete?</h2><button>Cancel</button>',
    );
    expect(document.querySelector("dialog.alert-dialog h2").textContent)
      .toBe("Delete?");
    expect(document.querySelector("dialog.alert-dialog button")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("alert-dialog", { classes: "danger" });
    expect(document.querySelector("dialog.alert-dialog.danger")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("alert-dialog", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});

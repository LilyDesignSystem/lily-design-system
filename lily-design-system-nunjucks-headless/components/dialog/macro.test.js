import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("dialog", () => {
  it("renders a <dialog> with the base class", () => {
    const { document } = render("dialog", {});
    expect(document.querySelector("dialog.dialog")).toBeTruthy();
  });

  it("sets id, aria-labelledby, aria-describedby", () => {
    const { document } = render("dialog", {
      id: "d1",
      labelledBy: "t1",
      describedBy: "d1-desc",
    });
    const el = document.querySelector("dialog");
    expect(el.getAttribute("id")).toBe("d1");
    expect(el.getAttribute("aria-labelledby")).toBe("t1");
    expect(el.getAttribute("aria-describedby")).toBe("d1-desc");
  });

  it("falls back to aria-label when labelledBy is absent", () => {
    const { document } = render("dialog", { label: "Confirm" });
    expect(document.querySelector("dialog").getAttribute("aria-label"))
      .toBe("Confirm");
  });

  it("sets the open attribute when params.open is true", () => {
    const { document } = render("dialog", { open: true });
    expect(document.querySelector("dialog").hasAttribute("open")).toBe(true);
  });

  it("renders caller block content", () => {
    const { document } = render(
      "dialog",
      { labelledBy: "t" },
      '<h2 id="t">Title</h2>',
    );
    expect(document.querySelector("dialog h2").textContent).toBe("Title");
  });

  it("appends params.classes", () => {
    const { document } = render("dialog", { classes: "narrow" });
    expect(document.querySelector("dialog.dialog.narrow")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("dialog", {});
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});

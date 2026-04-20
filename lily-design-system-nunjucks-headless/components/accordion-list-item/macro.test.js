import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("accordion-list-item", () => {
  it("renders an <li> containing <details> and <summary>", () => {
    const { document } = render("accordion-list-item", { summary: "Section 1" });
    const li = document.querySelector("li.accordion-list-item");
    expect(li).toBeTruthy();
    expect(li.querySelector("details.accordion-list-item-details")).toBeTruthy();
    expect(li.querySelector("summary.accordion-list-item-summary")).toBeTruthy();
  });

  it("puts the summary text inside <summary>", () => {
    const { document } = render("accordion-list-item", { summary: "A & B" });
    expect(document.querySelector("summary").textContent.trim()).toBe("A & B");
  });

  it("renders summaryHtml raw", () => {
    const { document } = render("accordion-list-item", {
      summaryHtml: "<strong>Title</strong>",
    });
    expect(document.querySelector("summary strong").textContent).toBe("Title");
  });

  it("sets open when params.open is true", () => {
    const { document } = render("accordion-list-item", {
      summary: "s",
      open: true,
    });
    expect(document.querySelector("details").hasAttribute("open")).toBe(true);
  });

  it("omits open by default", () => {
    const { document } = render("accordion-list-item", { summary: "s" });
    expect(document.querySelector("details").hasAttribute("open")).toBe(false);
  });

  it("supports the name attribute for mutually exclusive groups", () => {
    const { document } = render("accordion-list-item", {
      summary: "s",
      name: "group-a",
    });
    expect(document.querySelector("details").getAttribute("name")).toBe("group-a");
  });

  it("renders caller content inside the body", () => {
    const { document } = render(
      "accordion-list-item",
      { summary: "s" },
      '<p class="content">Hello</p>',
    );
    expect(
      document.querySelector(".accordion-list-item-body p.content"),
    ).toBeTruthy();
  });

  it("appends params.classes on the <li>", () => {
    const { document } = render("accordion-list-item", {
      summary: "s",
      classes: "boxed",
    });
    expect(document.querySelector("li.accordion-list-item.boxed")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("accordion-list-item", { summary: "s" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});

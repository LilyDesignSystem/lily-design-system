import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("tag", () => {
  it("renders a <span> with the base class", () => {
    const { document } = render("tag", { text: "Active" });
    const el = document.querySelector("span.tag");
    expect(el).toBeTruthy();
    expect(el.classList.contains("tag")).toBe(true);
    expect(el.textContent.trim()).toBe("Active");
  });

  it("escapes params.text", () => {
    const { document } = render("tag", { text: "A & B" });
    expect(document.querySelector("span.tag").textContent.trim()).toBe("A & B");
  });

  it("renders params.html raw", () => {
    const { document } = render("tag", { html: "<em>Beta</em>" });
    expect(document.querySelector("span.tag em")).toBeTruthy();
  });

  it("appends params.classes", () => {
    const { document } = render("tag", { text: "x", classes: "tag-red" });
    expect(document.querySelector("span.tag.tag-red")).toBeTruthy();
  });

  it("is not a live region; params.label is screen-reader text appended to the exposed content", () => {
    const { document } = render("tag", { text: "NEW", label: "New item" });
    const el = document.querySelector("span.tag");
    expect(el.hasAttribute("role")).toBe(false);
    expect(el.hasAttribute("aria-label")).toBe(false);
    expect(el.querySelector(".screen-reader-span").textContent).toBe("New item");
    expect(el.querySelector("[aria-hidden]")).toBeNull();
    expect(el.textContent.startsWith("NEW")).toBe(true);
  });

  it("params.live renders a status region named by aria-label", () => {
    const { document } = render("tag", { text: "Passing", label: "Build: Passing", live: true });
    const el = document.querySelector("span.tag");
    expect(el.getAttribute("role")).toBe("status");
    expect(el.getAttribute("aria-label")).toBe("Build: Passing");
    expect(el.textContent.trim()).toBe("Passing");
  });

  it("renders params.attributes", () => {
    const { document } = render("tag", {
      text: "x",
      attributes: { "data-state": "active" },
    });
    expect(document.querySelector("span.tag").getAttribute("data-state")).toBe("active");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("tag", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });

  it("keeps a control inside the tag exposed to assistive technology", () => {
    const { document } = render("tag", { html: 'Red <button type="button">Remove Red</button>', label: "filter" });
    expect(document.querySelector("span.tag button").closest("[aria-hidden]")).toBeNull();
  });
});

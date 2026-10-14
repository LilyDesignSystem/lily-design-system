import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("contents-link", () => {
  it("renders an <a> with the base class and href", () => {
    const { document } = render("contents-link", { href: "#s1", text: "Intro" });
    const el = document.querySelector("a.contents-link");
    expect(el).toBeTruthy();
    expect(el.getAttribute("href")).toBe("#s1");
  });

  it("defaults href to '#'", () => {
    const { document } = render("contents-link", { text: "x" });
    expect(document.querySelector("a").getAttribute("href")).toBe("#");
  });

  it("sets aria-current='location' when current is true", () => {
    const { document } = render("contents-link", {
      href: "/",
      text: "x",
      current: true,
    });
    expect(document.querySelector("a").getAttribute("aria-current"))
      .toBe("location");
  });

  it("escapes text", () => {
    const { document } = render("contents-link", { text: "A & B" });
    expect(document.querySelector("a").textContent.trim()).toBe("A & B");
  });

  it("renders html raw", () => {
    const { document } = render("contents-link", {
      html: "<em>Hi</em>",
    });
    expect(document.querySelector("a em").textContent).toBe("Hi");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("contents-link", { text: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });

  it("renders countLabel inside the link, after the text", () => {
    const { document } = render("contents-link", { href: "#a", text: "Address", count: 3, countLabel: "3 to do" });
    const a = document.querySelector("a.contents-link");
    expect(a.querySelector(".contents-link-count").textContent).toBe("3 to do");
    expect(a.textContent.trim()).toBe("Address 3 to do");
  });

  it("renders no count element without countLabel", () => {
    const { document } = render("contents-link", { href: "#a", text: "Address", count: 3 });
    expect(document.querySelector(".contents-link-count")).toBeNull();
  });

  it("sets data-count; zero adds data-complete; none sets neither", () => {
    const three = render("contents-link", { text: "x", count: 3 }).document.querySelector("a");
    expect(three.getAttribute("data-count")).toBe("3");
    expect(three.hasAttribute("data-complete")).toBe(false);
    const zero = render("contents-link", { text: "x", count: 0 }).document.querySelector("a");
    expect(zero.getAttribute("data-count")).toBe("0");
    expect(zero.hasAttribute("data-complete")).toBe(true);
    const none = render("contents-link", { text: "x" }).document.querySelector("a");
    expect(none.hasAttribute("data-count")).toBe(false);
    expect(none.hasAttribute("data-complete")).toBe(false);
  });
});

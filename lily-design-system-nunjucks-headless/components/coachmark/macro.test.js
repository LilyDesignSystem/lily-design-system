import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("coachmark", () => {
  it("renders a <div> dialog with the base class and role=dialog", () => {
    const { document } = render("coachmark", {
      title: "New feature",
      dismissLabel: "Dismiss",
      open: true,
    });
    const el = document.querySelector("div.coachmark");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("dialog");
    expect(el.getAttribute("aria-modal")).toBe("false");
  });

  it("renders the title and links it via aria-labelledby", () => {
    const { document } = render("coachmark", {
      id: "tip-1",
      title: "New feature",
      dismissLabel: "Dismiss",
      open: true,
    });
    const dialog = document.querySelector("div.coachmark");
    const titleId = dialog.getAttribute("aria-labelledby");
    expect(titleId).toBe("tip-1-title");
    const title = document.getElementById(titleId);
    expect(title).toBeTruthy();
    expect(title.textContent).toBe("New feature");
  });

  it("renders the description and links it via aria-describedby", () => {
    const { document } = render("coachmark", {
      id: "tip-2",
      title: "New feature",
      description: "Click here to try it out.",
      dismissLabel: "Dismiss",
      open: true,
    });
    const dialog = document.querySelector("div.coachmark");
    const descId = dialog.getAttribute("aria-describedby");
    expect(descId).toBe("tip-2-description");
    expect(document.getElementById(descId).textContent)
      .toBe("Click here to try it out.");
  });

  it("omits aria-describedby and the description element when no description is supplied", () => {
    const { document } = render("coachmark", {
      title: "New feature",
      dismissLabel: "Dismiss",
      open: true,
    });
    expect(document.querySelector("div.coachmark").hasAttribute("aria-describedby"))
      .toBe(false);
    expect(document.querySelector(".coachmark-description")).toBeNull();
  });

  it("renders hidden when open is false (default)", () => {
    const { document } = render("coachmark", {
      title: "New feature",
      dismissLabel: "Dismiss",
    });
    expect(document.querySelector("div.coachmark").hasAttribute("hidden"))
      .toBe(true);
  });

  it("does not render hidden when open is true", () => {
    const { document } = render("coachmark", {
      title: "New feature",
      dismissLabel: "Dismiss",
      open: true,
    });
    expect(document.querySelector("div.coachmark").hasAttribute("hidden"))
      .toBe(false);
  });

  it("renders the dismiss button with aria-label", () => {
    const { document } = render("coachmark", {
      title: "New feature",
      dismissLabel: "Dismiss",
      open: true,
    });
    const btn = document.querySelector("button.coachmark-dismiss");
    expect(btn).toBeTruthy();
    expect(btn.getAttribute("type")).toBe("button");
    expect(btn.getAttribute("aria-label")).toBe("Dismiss");
  });

  it("appends params.classes", () => {
    const { document } = render("coachmark", {
      title: "New feature",
      dismissLabel: "Dismiss",
      classes: "tip",
    });
    expect(document.querySelector("div.coachmark.tip")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("coachmark", {
      title: "New feature",
      dismissLabel: "Dismiss",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("div.coachmark").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("coachmark", {
      title: "New feature",
      dismissLabel: "Dismiss",
    });
    expect(html).not.toContain("<style");
  });
});

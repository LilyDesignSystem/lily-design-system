import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("info-state", () => {
  it("renders a <section> with the base class and default level", () => {
    const { document } = render("info-state", {
      title: "No results",
    });
    const el = document.querySelector("section.info-state");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("status");
    expect(el.getAttribute("data-level")).toBe("info");
  });

  it("respects a custom level", () => {
    const { document } = render("info-state", {
      title: "Oops",
      level: "error",
    });
    expect(
      document.querySelector("section.info-state").getAttribute("data-level"),
    ).toBe("error");
  });

  it("uses title as aria-label by default", () => {
    const { document } = render("info-state", {
      title: "No results",
    });
    expect(
      document.querySelector("section.info-state").getAttribute("aria-label"),
    ).toBe("No results");
  });

  it("respects a custom aria-label via params.label", () => {
    const { document } = render("info-state", {
      title: "X",
      label: "Empty state announcement",
    });
    expect(
      document.querySelector("section.info-state").getAttribute("aria-label"),
    ).toBe("Empty state announcement");
  });

  it("renders title as <h2>", () => {
    const { document } = render("info-state", { title: "No results" });
    const h2 = document.querySelector("section.info-state h2.info-state-title");
    expect(h2).toBeTruthy();
    expect(h2.textContent).toBe("No results");
  });

  it("renders description as <p>", () => {
    const { document } = render("info-state", {
      title: "No results",
      description: "Try a different search.",
    });
    const p = document.querySelector("section.info-state p.info-state-description");
    expect(p).toBeTruthy();
    expect(p.textContent).toBe("Try a different search.");
  });

  it("omits description when not provided", () => {
    const { document } = render("info-state", { title: "No results" });
    expect(document.querySelector("p.info-state-description")).toBeFalsy();
  });

  it("renders illustration HTML", () => {
    const { document } = render("info-state", {
      title: "Empty",
      illustration: "<svg></svg>",
    });
    expect(
      document.querySelector("section.info-state .info-state-illustration svg"),
    ).toBeTruthy();
  });

  it("renders action HTML", () => {
    const { document } = render("info-state", {
      title: "Empty",
      action: "<button>Reset</button>",
    });
    expect(
      document.querySelector("section.info-state .info-state-action button"),
    ).toBeTruthy();
  });

  it("renders caller block to override default body", () => {
    const { document } = render(
      "info-state",
      { title: "X" },
      "<div class='custom'>Custom body</div>",
    );
    expect(document.querySelector("section.info-state .custom")).toBeTruthy();
    // Custom body replaces default composition, so no .info-state-title
    expect(document.querySelector(".info-state-title")).toBeFalsy();
  });

  it("appends params.classes", () => {
    const { document } = render("info-state", {
      title: "X",
      classes: "centered",
    });
    expect(document.querySelector("section.info-state.centered")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("info-state", {
      title: "X",
      attributes: { "data-test": "v" },
    });
    expect(
      document.querySelector("section.info-state").getAttribute("data-test"),
    ).toBe("v");
  });

  it("contains no <style> tag", () => {
    const { html } = render("info-state", { title: "X" });
    expect(html).not.toContain("<style");
  });
});

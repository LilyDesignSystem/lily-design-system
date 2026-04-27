import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("government-banner", () => {
  const baseParams = {
    label: "Official government website",
    headerText: "An official website of the United States government",
    expandLabel: "Here's how you know",
  };

  it("renders an <aside> with the base class and aria-label", () => {
    const { document } = render("government-banner", baseParams);
    const el = document.querySelector("aside.government-banner");
    expect(el).toBeTruthy();
    expect(el.getAttribute("aria-label")).toBe("Official government website");
  });

  it("renders the header text", () => {
    const { document } = render("government-banner", baseParams);
    const span = document.querySelector(".government-banner-header-text");
    expect(span.textContent).toContain("official website");
  });

  it("renders the toggle button with expand label", () => {
    const { document } = render("government-banner", baseParams);
    const btn = document.querySelector("button.government-banner-toggle");
    expect(btn).toBeTruthy();
    expect(btn.getAttribute("type")).toBe("button");
    expect(btn.textContent.trim()).toBe("Here's how you know");
  });

  it("renders aria-expanded='false' by default", () => {
    const { document } = render("government-banner", baseParams);
    expect(document.querySelector("button.government-banner-toggle")
      .getAttribute("aria-expanded")).toBe("false");
  });

  it("renders aria-expanded='true' when expanded is true", () => {
    const { document } = render("government-banner", {
      ...baseParams,
      expanded: true,
    });
    expect(document.querySelector("button.government-banner-toggle")
      .getAttribute("aria-expanded")).toBe("true");
  });

  it("renders aria-controls referencing the panel id", () => {
    const { document } = render("government-banner", baseParams);
    const btn = document.querySelector("button.government-banner-toggle");
    const panel = document.querySelector(".government-banner-details");
    expect(btn.getAttribute("aria-controls")).toBe(panel.getAttribute("id"));
  });

  it("hides the details panel when collapsed", () => {
    const { document } = render("government-banner", baseParams);
    expect(document.querySelector(".government-banner-details").hasAttribute("hidden"))
      .toBe(true);
  });

  it("shows the details panel when expanded", () => {
    const { document } = render("government-banner", {
      ...baseParams,
      expanded: true,
    });
    expect(document.querySelector(".government-banner-details").hasAttribute("hidden"))
      .toBe(false);
  });

  it("uses custom panelId when provided", () => {
    const { document } = render("government-banner", {
      ...baseParams,
      panelId: "my-panel",
    });
    expect(document.querySelector(".government-banner-details").getAttribute("id"))
      .toBe("my-panel");
    expect(document.querySelector("button.government-banner-toggle")
      .getAttribute("aria-controls")).toBe("my-panel");
  });

  it("renders caller block content into details panel", () => {
    const { document } = render(
      "government-banner",
      { ...baseParams, expanded: true },
      "<p>The .gov means it's official.</p>",
    );
    expect(document.querySelector(".government-banner-details p").textContent)
      .toContain(".gov");
  });

  it("appends params.classes", () => {
    const { document } = render("government-banner", {
      ...baseParams,
      classes: "compact",
    });
    expect(document.querySelector("aside.government-banner.compact")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("government-banner", {
      ...baseParams,
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("aside.government-banner").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("government-banner", baseParams);
    expect(html).not.toContain("<style");
  });
});

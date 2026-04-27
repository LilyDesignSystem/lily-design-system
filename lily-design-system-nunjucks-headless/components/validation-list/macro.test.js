import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("validation-list", () => {
  it("renders a <ul> with the base class", () => {
    const { document } = render("validation-list", { label: "Password rules" });
    expect(document.querySelector("ul.validation-list")).toBeTruthy();
  });

  it("renders aria-label", () => {
    const { document } = render("validation-list", { label: "Password rules" });
    expect(document.querySelector("ul.validation-list").getAttribute("aria-label"))
      .toBe("Password rules");
  });

  it("renders aria-live='polite'", () => {
    const { document } = render("validation-list", { label: "Password rules" });
    expect(document.querySelector("ul.validation-list").getAttribute("aria-live"))
      .toBe("polite");
  });

  it("renders caller block content", () => {
    const { document } = render(
      "validation-list",
      { label: "Password rules" },
      "<li>One</li><li>Two</li>",
    );
    expect(document.querySelectorAll("ul.validation-list li").length).toBe(2);
  });

  it("renders raw html via params.html", () => {
    const { document } = render("validation-list", {
      label: "Password rules",
      html: "<li>html</li>",
    });
    expect(document.querySelector("ul.validation-list li").textContent).toBe("html");
  });

  it("appends params.classes", () => {
    const { document } = render("validation-list", {
      label: "Password rules",
      classes: "compact",
    });
    expect(document.querySelector("ul.validation-list.compact")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("validation-list", {
      label: "Password rules",
      attributes: { "data-test": "x" },
    });
    expect(document.querySelector("ul.validation-list").getAttribute("data-test"))
      .toBe("x");
  });

  it("contains no <style> tag", () => {
    const { html } = render("validation-list", { label: "Password rules" });
    expect(html).not.toContain("<style");
  });
});

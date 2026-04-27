import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("split-button", () => {
  it("renders a <div role='group'> with the base class", () => {
    const { document } = render("split-button", {
      label: "Save options",
      primaryLabel: "Save",
      menuLabel: "More save options",
    });
    const el = document.querySelector("div.split-button");
    expect(el).toBeTruthy();
    expect(el.getAttribute("role")).toBe("group");
  });

  it("renders aria-label on the group", () => {
    const { document } = render("split-button", {
      label: "Save options",
      primaryLabel: "Save",
      menuLabel: "More",
    });
    expect(
      document.querySelector("div.split-button").getAttribute("aria-label"),
    ).toBe("Save options");
  });

  it("renders the primary button with primaryLabel text", () => {
    const { document } = render("split-button", {
      label: "Save options",
      primaryLabel: "Save",
      menuLabel: "More",
    });
    const primary = document.querySelector("button.split-button-primary");
    expect(primary).toBeTruthy();
    expect(primary.getAttribute("type")).toBe("button");
    expect(primary.textContent.trim()).toBe("Save");
  });

  it("renders primaryHtml when provided (overrides primaryLabel)", () => {
    const { document } = render("split-button", {
      label: "Save options",
      primaryLabel: "Save",
      primaryHtml: "<span>S</span>ave",
      menuLabel: "More",
    });
    expect(document.querySelector("button.split-button-primary span"))
      .toBeTruthy();
  });

  it("renders the trigger button with menu semantics", () => {
    const { document } = render("split-button", {
      label: "Save options",
      primaryLabel: "Save",
      menuLabel: "More save options",
    });
    const trigger = document.querySelector("button.split-button-menu-trigger");
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute("type")).toBe("button");
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("aria-label")).toBe("More save options");
  });

  it("renders aria-expanded='true' when menuOpen is true", () => {
    const { document } = render("split-button", {
      label: "Save options",
      primaryLabel: "Save",
      menuLabel: "More",
      menuOpen: true,
    });
    expect(
      document
        .querySelector("button.split-button-menu-trigger")
        .getAttribute("aria-expanded"),
    ).toBe("true");
  });

  it("hides the menu container by default", () => {
    const { document } = render("split-button", {
      label: "Save options",
      primaryLabel: "Save",
      menuLabel: "More",
    });
    expect(
      document.querySelector("div.split-button-menu").hasAttribute("hidden"),
    ).toBe(true);
  });

  it("shows the menu container when menuOpen is true", () => {
    const { document } = render("split-button", {
      label: "Save options",
      primaryLabel: "Save",
      menuLabel: "More",
      menuOpen: true,
    });
    expect(
      document.querySelector("div.split-button-menu").hasAttribute("hidden"),
    ).toBe(false);
  });

  it("renders caller block as menu content", () => {
    const { document } = render(
      "split-button",
      {
        label: "Save options",
        primaryLabel: "Save",
        menuLabel: "More",
        menuOpen: true,
      },
      '<ul role="menu"><li role="menuitem">Save as…</li></ul>',
    );
    expect(
      document.querySelector("div.split-button-menu ul[role=menu]"),
    ).toBeTruthy();
  });

  it("disables both buttons when disabled is true", () => {
    const { document } = render("split-button", {
      label: "Save options",
      primaryLabel: "Save",
      menuLabel: "More",
      disabled: true,
    });
    expect(
      document
        .querySelector("button.split-button-primary")
        .hasAttribute("disabled"),
    ).toBe(true);
    expect(
      document
        .querySelector("button.split-button-menu-trigger")
        .hasAttribute("disabled"),
    ).toBe(true);
  });

  it("wires aria-controls when menuId is provided", () => {
    const { document } = render("split-button", {
      label: "Save options",
      primaryLabel: "Save",
      menuLabel: "More",
      menuId: "my-menu",
    });
    expect(
      document
        .querySelector("button.split-button-menu-trigger")
        .getAttribute("aria-controls"),
    ).toBe("my-menu");
    expect(document.querySelector("div.split-button-menu").getAttribute("id"))
      .toBe("my-menu");
  });

  it("appends params.classes", () => {
    const { document } = render("split-button", {
      label: "x",
      primaryLabel: "x",
      menuLabel: "x",
      classes: "primary",
    });
    expect(document.querySelector("div.split-button.primary")).toBeTruthy();
  });

  it("renders params.attributes", () => {
    const { document } = render("split-button", {
      label: "x",
      primaryLabel: "x",
      menuLabel: "x",
      attributes: { "data-test": "v" },
    });
    expect(
      document.querySelector("div.split-button").getAttribute("data-test"),
    ).toBe("v");
  });

  it("contains no <style> or <script> tag", () => {
    const { html } = render("split-button", {
      label: "x",
      primaryLabel: "x",
      menuLabel: "x",
    });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});

import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("select", () => {
  it("renders a <select> with the base class", () => {
    const { document } = render("select", { id: "c" });
    const el = document.querySelector("select.select");
    expect(el).toBeTruthy();
    expect(el.getAttribute("id")).toBe("c");
  });

  it("defaults name to id", () => {
    const { document } = render("select", { id: "country" });
    expect(document.querySelector("select").getAttribute("name")).toBe("country");
  });

  it("renders options from params.options", () => {
    const { document } = render("select", {
      id: "c",
      options: [
        { value: "gb", text: "United Kingdom" },
        { value: "ie", text: "Ireland" },
      ],
    });
    const opts = document.querySelectorAll("select option");
    expect(opts.length).toBe(2);
    expect(opts[0].getAttribute("value")).toBe("gb");
    expect(opts[0].textContent.trim()).toBe("United Kingdom");
  });

  it("marks the option with matching params.value as selected", () => {
    const { document } = render("select", {
      id: "c",
      value: "ie",
      options: [
        { value: "gb", text: "UK" },
        { value: "ie", text: "Ireland" },
      ],
    });
    const opts = document.querySelectorAll("select option");
    expect(opts[0].hasAttribute("selected")).toBe(false);
    expect(opts[1].hasAttribute("selected")).toBe(true);
  });

  it("respects explicit option.selected", () => {
    const { document } = render("select", {
      id: "c",
      options: [
        { value: "a", text: "A" },
        { value: "b", text: "B", selected: true },
      ],
    });
    const opts = document.querySelectorAll("select option");
    expect(opts[1].hasAttribute("selected")).toBe(true);
  });

  it("marks disabled options", () => {
    const { document } = render("select", {
      id: "c",
      options: [
        { value: "", text: "Choose…", disabled: true },
        { value: "a", text: "A" },
      ],
    });
    const opts = document.querySelectorAll("select option");
    expect(opts[0].hasAttribute("disabled")).toBe(true);
    expect(opts[1].hasAttribute("disabled")).toBe(false);
  });

  it("supports multiple and size", () => {
    const { document } = render("select", {
      id: "c",
      multiple: true,
      size: 5,
    });
    const el = document.querySelector("select");
    expect(el.hasAttribute("multiple")).toBe(true);
    expect(el.getAttribute("size")).toBe("5");
  });

  it("supports required, disabled, invalid, errormessage", () => {
    const { document } = render("select", {
      id: "c",
      required: true,
      disabled: true,
      invalid: true,
      errormessage: "c-error",
    });
    const el = document.querySelector("select");
    expect(el.hasAttribute("required")).toBe(true);
    expect(el.hasAttribute("disabled")).toBe(true);
    expect(el.getAttribute("aria-invalid")).toBe("true");
    expect(el.getAttribute("aria-errormessage")).toBe("c-error");
  });

  it("renders caller block when no options are provided", () => {
    const { document } = render(
      "select",
      { id: "c" },
      '<option value="x">X</option>',
    );
    const opts = document.querySelectorAll("select option");
    expect(opts.length).toBe(1);
    expect(opts[0].getAttribute("value")).toBe("x");
  });

  it("appends params.classes", () => {
    const { document } = render("select", { id: "c", classes: "wide" });
    expect(document.querySelector("select.select.wide")).toBeTruthy();
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("select", { id: "c" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
    expect(html).not.toContain("style=");
  });
});

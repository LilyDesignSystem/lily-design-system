import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

const name = "wheel-picker";
const options = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April", disabled: true },
];
const base = { label: "Month", options, value: "2" };

describe("wheelPicker", () => {
  it("renders a div with the base class first, then the consumer class", () => {
    const { document } = render(name, { ...base, classes: "mine" });
    expect(document.querySelector("div.wheel-picker").getAttribute("class")).toBe("wheel-picker mine");
  });

  it("renders a vertical, named listbox with one option per entry", () => {
    const { document } = render(name, base);
    const list = document.querySelector(".wheel-picker-list");
    expect(list.getAttribute("role")).toBe("listbox");
    expect(list.getAttribute("aria-orientation")).toBe("vertical");
    expect(list.getAttribute("aria-label")).toBe("Month");
    expect(list.getAttribute("tabindex")).toBe("0");
    expect(document.querySelectorAll("[role=option]")).toHaveLength(4);
  });

  it("marks only the selected option and points aria-activedescendant at it", () => {
    const { document } = render(name, base);
    const selected = document.querySelectorAll('[aria-selected="true"]');
    expect(selected).toHaveLength(1);
    expect(selected[0].textContent).toBe("February");
    expect(document.querySelector(".wheel-picker-list").getAttribute("aria-activedescendant")).toBe(selected[0].id);
  });

  it("selects nothing, and omits aria-activedescendant, for an unknown value", () => {
    const { document } = render(name, { ...base, value: "zzz" });
    expect(document.querySelectorAll('[aria-selected="true"]')).toHaveLength(0);
    expect(document.querySelector(".wheel-picker-list").hasAttribute("aria-activedescendant")).toBe(false);
  });

  it("marks disabled options with aria-disabled", () => {
    const { document } = render(name, base);
    expect(document.querySelector('[data-value="4"]').getAttribute("aria-disabled")).toBe("true");
    expect(document.querySelector('[data-value="3"]').hasAttribute("aria-disabled")).toBe(false);
  });

  it("carries loop and page size as data attributes for the browser script", () => {
    const { document } = render(name, { ...base, loop: true, pageSize: 3 });
    const root = document.querySelector(".wheel-picker");
    expect(root.hasAttribute("data-loop")).toBe(true);
    expect(root.getAttribute("data-page-size")).toBe("3");
    const plain = render(name, base).document.querySelector(".wheel-picker");
    expect(plain.hasAttribute("data-loop")).toBe(false);
  });

  it("when disabled: not focusable and aria-disabled", () => {
    const { document } = render(name, { ...base, disabled: true });
    const list = document.querySelector(".wheel-picker-list");
    expect(list.getAttribute("tabindex")).toBe("-1");
    expect(list.getAttribute("aria-disabled")).toBe("true");
  });

  it("renders a hidden input only when a name is given, carrying the value", () => {
    expect(render(name, base).document.querySelector("input")).toBeNull();
    const input = render(name, { ...base, name: "month" }).document.querySelector("input[type=hidden]");
    expect(input.getAttribute("name")).toBe("month");
    expect(input.getAttribute("value")).toBe("2");
  });

  it("uses id as the root id and the option id prefix", () => {
    const { document } = render(name, { ...base, id: "m" });
    expect(document.querySelector(".wheel-picker").id).toBe("m");
    expect(document.querySelector("[role=option]").id).toBe("m-option-0");
  });

  it("escapes labels", () => {
    const { document } = render(name, { ...base, options: [{ value: "x", label: "<b>x</b>" }] });
    expect(document.querySelector("[role=option]").textContent).toBe("<b>x</b>");
    expect(document.querySelector("[role=option] b")).toBeNull();
  });
});

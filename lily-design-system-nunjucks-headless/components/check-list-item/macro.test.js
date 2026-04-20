import { describe, it, expect } from "vitest";
import { render } from "../../test/render.js";

describe("check-list-item", () => {
  it("renders an <li> with the base class and a checkbox input", () => {
    const { document } = render("check-list-item", {
      id: "task-1",
      label: "Task 1",
    });
    const li = document.querySelector("li.check-list-item");
    expect(li).toBeTruthy();
    const input = li.querySelector("input[type='checkbox'].check-list-item-input");
    expect(input).toBeTruthy();
    expect(input.getAttribute("id")).toBe("task-1-input");
  });

  it("associates the label with the input via for", () => {
    const { document } = render("check-list-item", {
      id: "task-1",
      label: "Task 1",
    });
    const label = document.querySelector("label.check-list-item-label");
    expect(label.getAttribute("for")).toBe("task-1-input");
  });

  it("respects custom inputId", () => {
    const { document } = render("check-list-item", {
      inputId: "custom",
      label: "x",
    });
    const input = document.querySelector("input");
    const label = document.querySelector("label");
    expect(input.getAttribute("id")).toBe("custom");
    expect(label.getAttribute("for")).toBe("custom");
  });

  it("sets checked when provided", () => {
    const { document } = render("check-list-item", {
      id: "x",
      label: "x",
      checked: true,
    });
    expect(document.querySelector("input").hasAttribute("checked")).toBe(true);
  });

  it("supports disabled", () => {
    const { document } = render("check-list-item", {
      id: "x",
      label: "x",
      disabled: true,
    });
    expect(document.querySelector("input").hasAttribute("disabled")).toBe(true);
  });

  it("sets name and value when provided", () => {
    const { document } = render("check-list-item", {
      id: "x",
      label: "x",
      name: "tasks[]",
      value: "task-1",
    });
    const input = document.querySelector("input");
    expect(input.getAttribute("name")).toBe("tasks[]");
    expect(input.getAttribute("value")).toBe("task-1");
  });

  it("renders labelHtml raw", () => {
    const { document } = render("check-list-item", {
      id: "x",
      labelHtml: "<strong>Important</strong>",
    });
    expect(document.querySelector("label strong").textContent).toBe("Important");
  });

  it("contains no <style> or <script> tags", () => {
    const { html } = render("check-list-item", { id: "x", label: "x" });
    expect(html).not.toContain("<style");
    expect(html).not.toContain("<script");
  });
});

import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./BreadcrumbListItem.vue";


describe("BreadcrumbListItem", () => {
  test("renders a list item", () => {
    render(Subject, { props: { "data-testid": "bli" }, slots: { default: "Home" } });
    expect(screen.getByTestId("bli").tagName).toBe("LI");
  });

  test("renders children", () => {
    render(Subject, { slots: { default: "About" } });
    expect(screen.getByText("About")).toBeTruthy();
  });

  test("sets aria-current for current page", () => {
    render(Subject, { props: { current: true,
        "data-testid": "c" }, slots: { default: "Here" } });
    expect(screen.getByTestId("c").hasAttribute("data-current")).toBe(true);
    // The item marks itself with data-current; aria-current is the consumer's, on the link or text inside.
    expect(screen.getByTestId("c").hasAttribute("aria-current")).toBe(false);
  });

  test("no aria-current when not current", () => {
    render(Subject, { props: { "data-testid": "nc" }, slots: { default: "Link" } });
    expect(screen.getByTestId("nc").hasAttribute("data-current")).toBe(false);
  });

  test("passes through attributes", () => {
    render(Subject, { props: { "data-testid": "item" }, slots: { default: "X" } });
    expect(screen.getByTestId("item")).toBeTruthy();
  });
});

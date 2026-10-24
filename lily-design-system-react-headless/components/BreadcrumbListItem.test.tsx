import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./BreadcrumbListItem";

describe("BreadcrumbListItem", () => {
  test("renders a list item", () => {
    render(<Subject data-testid="bli">Home</Subject>);
    expect(screen.getByTestId("bli").tagName).toBe("LI");
  });

  test("renders children", () => {
    render(<Subject>About</Subject>);
    expect(screen.getByText("About")).toBeTruthy();
  });

  test("sets aria-current for current page", () => {
    render(<Subject current data-testid="c">Here</Subject>);
    expect(screen.getByTestId("c").hasAttribute("data-current")).toBe(true);
    // The item marks itself with data-current; aria-current is the consumer's, on the link or text inside.
    expect(screen.getByTestId("c").hasAttribute("aria-current")).toBe(false);
  });

  test("no aria-current when not current", () => {
    render(<Subject data-testid="nc">Link</Subject>);
    expect(screen.getByTestId("nc").hasAttribute("data-current")).toBe(false);
  });

  test("passes through attributes", () => {
    render(<Subject data-testid="item">X</Subject>);
    expect(screen.getByTestId("item")).toBeTruthy();
  });
});

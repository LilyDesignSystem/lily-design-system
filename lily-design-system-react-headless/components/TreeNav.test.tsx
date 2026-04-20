import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./TreeNav";

describe("TreeNav", () => {
  test("renders a navigation landmark", () => {
    render(
      <Subject label="Nav">
        <li role="treeitem" tabIndex={-1}>Home</li>
        <li role="treeitem" tabIndex={-1}>About</li>
      </Subject>
    );
    expect(screen.getByRole("navigation")).toBeTruthy();
  });

  test("has aria-label", () => {
    render(
      <Subject label="Navigation">
        <li role="treeitem" tabIndex={-1}>Home</li>
        <li role="treeitem" tabIndex={-1}>About</li>
      </Subject>
    );
    expect(screen.getByLabelText("Navigation")).toBeTruthy();
  });

  test("renders treeitem children", () => {
    render(
      <Subject label="Nav">
        <li role="treeitem" tabIndex={-1}>Home</li>
        <li role="treeitem" tabIndex={-1}>About</li>
      </Subject>
    );
    expect(screen.getAllByRole("treeitem").length).toBe(2);
  });

  test("passes through attributes", () => {
    render(
      <Subject label="N" data-testid="tm">
        <li role="treeitem" tabIndex={-1}>Home</li>
        <li role="treeitem" tabIndex={-1}>About</li>
      </Subject>
    );
    expect(screen.getByTestId("tm")).toBeTruthy();
  });
});

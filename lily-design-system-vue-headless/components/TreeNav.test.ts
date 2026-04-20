import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./TreeNav.vue";


describe("TreeNav", () => {
  test("renders a navigation landmark", () => {
    render(Subject, { props: { label: "Nav" }, slots: { default: "<li role='treeitem' tabindex='-1'>Home</li><li role='treeitem' tabindex='-1'>About</li>" } });
    expect(screen.getByRole("navigation")).toBeTruthy();
  });

  test("has aria-label", () => {
    render(Subject, { props: { label: "Navigation" }, slots: { default: "<li role='treeitem' tabindex='-1'>Home</li><li role='treeitem' tabindex='-1'>About</li>" } });
    expect(screen.getByLabelText("Navigation")).toBeTruthy();
  });

  test("renders treeitem children", () => {
    render(Subject, { props: { label: "Nav" }, slots: { default: "<li role='treeitem' tabindex='-1'>Home</li><li role='treeitem' tabindex='-1'>About</li>" } });
    expect(screen.getAllByRole("treeitem").length).toBe(2);
  });

  test("passes through attributes", () => {
    render(Subject, { props: { label: "N", "data-testid": "tm" }, slots: { default: "<li role='treeitem' tabindex='-1'>Home</li><li role='treeitem' tabindex='-1'>About</li>" } });
    expect(screen.getByTestId("tm")).toBeTruthy();
  });
});

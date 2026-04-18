import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./TreeNav.svelte";

function treeItemsSnippet() {
  return (($anchor: Comment) => {
    const li1 = document.createElement("li");
    li1.setAttribute("role", "treeitem");
    li1.setAttribute("tabindex", "-1");
    li1.textContent = "Home";
    const li2 = document.createElement("li");
    li2.setAttribute("role", "treeitem");
    li2.setAttribute("tabindex", "-1");
    li2.textContent = "About";
    $anchor.before(li1, li2);
  }) as any;
}

describe("TreeNav", () => {
  test("renders a tree", () => {
    render(Subject, { props: { label: "Nav", children: treeItemsSnippet() } });
    expect(screen.getByRole("tree")).toBeTruthy();
  });

  test("has aria-label", () => {
    render(Subject, {
      props: { label: "Navigation", children: treeItemsSnippet() },
    });
    expect(screen.getByLabelText("Navigation")).toBeTruthy();
  });

  test("renders treeitem children", () => {
    render(Subject, { props: { label: "Nav", children: treeItemsSnippet() } });
    expect(screen.getAllByRole("treeitem").length).toBe(2);
  });

  test("passes through attributes", () => {
    render(Subject, {
      props: { label: "N", "data-testid": "tm", children: treeItemsSnippet() },
    });
    expect(screen.getByTestId("tm")).toBeTruthy();
  });
});

import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./TabBar.svelte";

function tabsSnippet() {
  return (($anchor: Comment) => {
    const tab1 = document.createElement("button");
    tab1.setAttribute("role", "tab");
    tab1.setAttribute("aria-selected", "true");
    tab1.textContent = "General";
    const tab2 = document.createElement("button");
    tab2.setAttribute("role", "tab");
    tab2.setAttribute("aria-selected", "false");
    tab2.textContent = "Advanced";
    $anchor.before(tab1, tab2);
  }) as any;
}

describe("TabBar", () => {
  test("renders a tablist", () => {
    render(Subject, { props: { label: "Settings", children: tabsSnippet() } });
    expect(screen.getByRole("tablist")).toBeTruthy();
  });

  test("has aria-label", () => {
    render(Subject, { props: { label: "Settings", children: tabsSnippet() } });
    expect(screen.getByLabelText("Settings")).toBeTruthy();
  });

  test("renders tab children", () => {
    render(Subject, { props: { label: "Settings", children: tabsSnippet() } });
    expect(screen.getAllByRole("tab").length).toBe(2);
  });

  test("arrow right navigates to next tab", () => {
    render(Subject, { props: { label: "Settings", children: tabsSnippet() } });
    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();
    tabs[0].dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
    expect(document.activeElement).toBe(tabs[1]);
  });

  test("passes through attributes", () => {
    render(Subject, {
      props: { label: "S", "data-testid": "tg", children: tabsSnippet() },
    });
    expect(screen.getByTestId("tg")).toBeTruthy();
  });
});

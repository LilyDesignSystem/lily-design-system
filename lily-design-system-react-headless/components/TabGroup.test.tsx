import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./TabGroup";

const tabChildren = (
  <>
    <button role="tab" aria-selected="true">General</button>
    <button role="tab" aria-selected="false">Advanced</button>
  </>
);

describe("TabGroup", () => {
  test("renders a tablist", () => {
    render(<Subject label="Settings">{tabChildren}</Subject>);
    expect(screen.getByRole("tablist")).toBeTruthy();
  });

  test("has aria-label", () => {
    render(<Subject label="Settings">{tabChildren}</Subject>);
    expect(screen.getByLabelText("Settings")).toBeTruthy();
  });

  test("renders tab children", () => {
    render(<Subject label="Settings">{tabChildren}</Subject>);
    expect(screen.getAllByRole("tab").length).toBe(2);
  });

  test("arrow right navigates to next tab", () => {
    render(<Subject label="Settings">{tabChildren}</Subject>);
    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();
    tabs[0].dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
    expect(document.activeElement).toBe(tabs[1]);
  });

  test("passes through attributes", () => {
    render(<Subject label="S" data-testid="tg">{tabChildren}</Subject>);
    expect(screen.getByTestId("tg")).toBeTruthy();
  });
});

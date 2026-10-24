import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./TourListItem";

describe("TourListItem", () => {
  test("renders with role group", () => {
    render(<Subject label="Welcome" current>Step content</Subject>);
    expect(screen.getByRole("group")).toBeTruthy();
  });

  test("renders children content", () => {
    render(<Subject label="Welcome" current>Hello world</Subject>);
    expect(screen.getByText("Hello world")).toBeTruthy();
  });

  test("has aria-label", () => {
    render(<Subject label="Welcome step" current>content</Subject>);
    expect(screen.getByLabelText("Welcome step")).toBeTruthy();
  });

  test("has aria-roledescription step", () => {
    render(<Subject label="Welcome" current>content</Subject>);
    const el = screen.getByRole("group");
    expect(el.getAttribute("aria-roledescription")).toBe("step");
  });

  test("has data-current when current", () => {
    render(<Subject label="Welcome" current>content</Subject>);
    const el = screen.getByRole("group");
    expect(el.hasAttribute("data-current")).toBe(true);
    // The item marks itself with data-current; aria-current is the consumer's, on the link or text inside.
    expect(el.hasAttribute("aria-current")).toBe(false);
  });

  test("hidden when not current", () => {
    render(<Subject label="Welcome" current={false}>content</Subject>);
    const el = document.querySelector("[aria-roledescription='step']");
    expect(el).toBeTruthy();
    expect(el!.getAttribute("aria-hidden")).toBe("true");
    expect((el as HTMLElement).hidden).toBe(true);
  });

  test("not hidden when current", () => {
    render(<Subject label="Welcome" current>content</Subject>);
    const el = screen.getByRole("group");
    expect(el.getAttribute("aria-hidden")).toBeNull();
    expect((el as HTMLElement).hidden).toBe(false);
  });

  test("includes step progress in label", () => {
    render(<Subject label="Features" current stepNumber={2} totalSteps={5}>content</Subject>);
    expect(screen.getByLabelText("Features (Step 2 of 5)")).toBeTruthy();
  });

  test("label without step numbers when not provided", () => {
    render(<Subject label="Intro" current>content</Subject>);
    expect(screen.getByLabelText("Intro")).toBeTruthy();
  });

  test("passes through attributes", () => {
    render(<Subject label="Step" current data-testid="tour-step">content</Subject>);
    expect(screen.getByTestId("tour-step")).toBeTruthy();
  });

  test("defaults current to false", () => {
    render(<Subject label="Step">content</Subject>);
    const el = document.querySelector("[aria-roledescription='step']");
    expect(el).toBeTruthy();
    expect((el as HTMLElement).hidden).toBe(true);
  });
});

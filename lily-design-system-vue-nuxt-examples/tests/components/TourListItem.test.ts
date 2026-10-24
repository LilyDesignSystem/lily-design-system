import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "../../components/TourListItem.vue";


describe("TourListItem", () => {
  test("renders with role group", () => {
    render(Subject, { props: { label: "Welcome",
        current: true }, slots: { default: "Step content" } });
    expect(screen.getByRole("group")).toBeTruthy();
  });

  test("renders children content", () => {
    render(Subject, { props: { label: "Welcome",
        current: true }, slots: { default: "Hello world" } });
    expect(screen.getByText("Hello world")).toBeTruthy();
  });

  test("has aria-label", () => {
    render(Subject, { props: { label: "Welcome step",
        current: true }, slots: { default: "content" } });
    expect(screen.getByLabelText("Welcome step")).toBeTruthy();
  });

  test("has aria-roledescription step", () => {
    render(Subject, { props: { label: "Welcome",
        current: true }, slots: { default: "content" } });
    const el = screen.getByRole("group");
    expect(el.getAttribute("aria-roledescription")).toBe("step");
  });

  test("has data-current when current", () => {
    render(Subject, { props: { label: "Welcome",
        current: true }, slots: { default: "content" } });
    const el = screen.getByRole("group");
    expect(el.hasAttribute("data-current")).toBe(true);
    // The item marks itself with data-current; aria-current is the consumer's, on the link or text inside.
    expect(el.hasAttribute("aria-current")).toBe(false);
  });

  test("hidden when not current", () => {
    render(Subject, { props: { label: "Welcome",
        current: false }, slots: { default: "content" } });
    const el = document.querySelector("[aria-roledescription='step']");
    expect(el).toBeTruthy();
    expect(el!.getAttribute("aria-hidden")).toBe("true");
    expect((el as HTMLElement).hidden).toBe(true);
  });

  test("not hidden when current", () => {
    render(Subject, { props: { label: "Welcome",
        current: true }, slots: { default: "content" } });
    const el = screen.getByRole("group");
    expect(el.getAttribute("aria-hidden")).toBeNull();
    expect((el as HTMLElement).hidden).toBe(false);
  });

  test("includes step progress in label", () => {
    render(Subject, { props: { label: "Features",
        current: true,
        stepNumber: 2,
        totalSteps: 5 }, slots: { default: "content" } });
    expect(screen.getByLabelText("Features (Step 2 of 5)")).toBeTruthy();
  });

  test("label without step numbers when not provided", () => {
    render(Subject, { props: { label: "Intro",
        current: true }, slots: { default: "content" } });
    expect(screen.getByLabelText("Intro")).toBeTruthy();
  });

  test("passes through attributes", () => {
    render(Subject, { props: { label: "Step",
        current: true,
        "data-testid": "tour-step" }, slots: { default: "content" } });
    expect(screen.getByTestId("tour-step")).toBeTruthy();
  });

  test("defaults current to false", () => {
    render(Subject, { props: { label: "Step" }, slots: { default: "content" } });
    const el = document.querySelector("[aria-roledescription='step']");
    expect(el).toBeTruthy();
    expect((el as HTMLElement).hidden).toBe(true);
  });
});

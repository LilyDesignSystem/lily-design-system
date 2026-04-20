import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./TabGroup.vue";


describe("TabGroup", () => {
  test("renders a tablist", () => {
    render(Subject, { props: { label: "Settings" }, slots: { default: "<button role='tab'>General</button><button role='tab'>Advanced</button>" } });
    expect(screen.getByRole("tablist")).toBeTruthy();
  });

  test("has aria-label", () => {
    render(Subject, { props: { label: "Settings" }, slots: { default: "<button role='tab'>General</button><button role='tab'>Advanced</button>" } });
    expect(screen.getByLabelText("Settings")).toBeTruthy();
  });

  test("renders tab children", () => {
    render(Subject, { props: { label: "Settings" }, slots: { default: "<button role='tab'>General</button><button role='tab'>Advanced</button>" } });
    expect(screen.getAllByRole("tab").length).toBe(2);
  });

  test("arrow right navigates to next tab", () => {
    render(Subject, { props: { label: "Settings" }, slots: { default: "<button role='tab'>General</button><button role='tab'>Advanced</button>" } });
    const tabs = screen.getAllByRole("tab");
    tabs[0].focus();
    tabs[0].dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
    );
    expect(document.activeElement).toBe(tabs[1]);
  });

  test("passes through attributes", () => {
    render(Subject, { props: { label: "S", "data-testid": "tg" }, slots: { default: "<button role='tab'>General</button><button role='tab'>Advanced</button>" } });
    expect(screen.getByTestId("tg")).toBeTruthy();
  });
});

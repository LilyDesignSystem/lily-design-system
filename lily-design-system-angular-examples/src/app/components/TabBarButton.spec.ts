import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TabBarButton } from "./TabBarButton";

describe("TabBarButton", () => {
  test("renders the button root with the base class", () => {
    const fixture = TestBed.createComponent(TabBarButton);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.tab-bar-button");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TabBarButton);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.tab-bar-button");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

describe("TabBarButton — tab semantics", () => {
  function create(inputs: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(TabBarButton);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector("button") as HTMLButtonElement;
  }

  test("is role=tab, unselected and out of the tab order by default", () => {
    const b = create();
    expect(b.getAttribute("role")).toBe("tab");
    expect(b.getAttribute("aria-selected")).toBe("false");
    expect(b.getAttribute("tabindex")).toBe("-1");
    expect(b.hasAttribute("aria-controls")).toBe(false);
  });

  test("the selected tab is aria-selected and tabbable (roving tabindex)", () => {
    const b = create({ selected: true, controls: "panel-1" });
    expect(b.getAttribute("aria-selected")).toBe("true");
    expect(b.getAttribute("tabindex")).toBe("0");
    expect(b.getAttribute("aria-controls")).toBe("panel-1");
  });
});

import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ContentsLink } from "./ContentsLink";

describe("ContentsLink", () => {
  test("renders the a root with the base class", () => {
    const fixture = TestBed.createComponent(ContentsLink);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("a.contents-link");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ContentsLink);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("a.contents-link");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

describe("ContentsLink count", () => {
  function mount(inputs: Record<string, unknown>) {
    const fixture = TestBed.createComponent(ContentsLink);
    for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector("a.contents-link") as HTMLElement;
  }

  test("countLabel renders inside the link", () => {
    const a = mount({ count: 3, countLabel: "3 to do" });
    expect(a.querySelector(".contents-link-count")!.textContent).toBe("3 to do");
  });

  test("no countLabel renders no count element", () => {
    expect(mount({ count: 3 }).querySelector(".contents-link-count")).toBeNull();
  });

  test("count sets data-count; zero adds data-complete; none sets neither", () => {
    const three = mount({ count: 3 });
    expect(three.getAttribute("data-count")).toBe("3");
    expect(three.hasAttribute("data-complete")).toBe(false);
    const zero = mount({ count: 0 });
    expect(zero.getAttribute("data-count")).toBe("0");
    expect(zero.hasAttribute("data-complete")).toBe(true);
    const none = mount({});
    expect(none.hasAttribute("data-count")).toBe(false);
    expect(none.hasAttribute("data-complete")).toBe(false);
  });
});

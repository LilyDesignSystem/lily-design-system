import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { EmptyState } from "./EmptyState";

@Component({
  standalone: true,
  imports: [EmptyState],
  template: `<lily-empty-state className="extra"><h2>Nothing here</h2><button>Add</button></lily-empty-state>`,
})
class Plain {}

@Component({
  standalone: true,
  imports: [EmptyState],
  template: `<lily-empty-state label="No results"><p>Try again</p></lily-empty-state>`,
})
class Labelled {}

describe("EmptyState", () => {
  test("renders a <div> with the empty-state class first", () => {
    const f = TestBed.createComponent(Plain);
    f.detectChanges();
    const el = f.nativeElement.querySelector("div") as HTMLElement;
    expect(el.classList.contains("extra")).toBe(true);
  });

  test("renders consumer children", () => {
    const f = TestBed.createComponent(Plain);
    f.detectChanges();
    expect(f.nativeElement.querySelector("h2").textContent).toBe("Nothing here");
    expect(f.nativeElement.querySelector("button")).toBeTruthy();
  });

  test("without label there is no role and no aria-label", () => {
    const f = TestBed.createComponent(Plain);
    f.detectChanges();
    const el = f.nativeElement.querySelector(".empty-state") as HTMLElement;
    expect(el.hasAttribute("role")).toBe(false);
    expect(el.hasAttribute("aria-label")).toBe(false);
  });

  test("with label it is a labelled group", () => {
    const f = TestBed.createComponent(Labelled);
    f.detectChanges();
    const el = f.nativeElement.querySelector(".empty-state") as HTMLElement;
    expect(el.getAttribute("role")).toBe("group");
    expect(el.getAttribute("aria-label")).toBe("No results");
  });

  test("is not a live region", () => {
    const f = TestBed.createComponent(Labelled);
    f.detectChanges();
    const el = f.nativeElement.querySelector(".empty-state") as HTMLElement;
    expect(el.hasAttribute("aria-live")).toBe(false);
    expect(el.getAttribute("role")).not.toBe("alert");
    expect(el.getAttribute("role")).not.toBe("status");
  });
});

import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Tag } from "./Tag";

describe("Tag", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(Tag);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.tag");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Tag);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.tag");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });

  test("is not a live region by default; the label is screen-reader text", () => {
    const fixture = TestBed.createComponent(Tag);
    fixture.componentRef.setInput("label", "Priority: High");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.tag");
    expect(el.hasAttribute("role")).toBe(false);
    expect(el.hasAttribute("aria-label")).toBe(false);
    expect(el.querySelector(".screen-reader-span").textContent).toBe("Priority: High");
    expect(el.querySelector("[aria-hidden]")).toBeNull();
  });

  test("live renders a status region named by aria-label", () => {
    const fixture = TestBed.createComponent(Tag);
    fixture.componentRef.setInput("label", "Build: Passing");
    fixture.componentRef.setInput("live", true);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.tag");
    expect(el.getAttribute("role")).toBe("status");
    expect(el.getAttribute("aria-label")).toBe("Build: Passing");
  });
});

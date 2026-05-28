import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { BreadcrumbList } from "./BreadcrumbList";

describe("BreadcrumbList", () => {
  test("renders the ol root with the base class", () => {
    const fixture = TestBed.createComponent(BreadcrumbList);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ol.breadcrumb-list");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(BreadcrumbList);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ol.breadcrumb-list");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { BreadcrumbListItem } from "./BreadcrumbListItem";
import { BreadcrumbList } from "./BreadcrumbList";

// BreadcrumbListItem is an attribute-selector component (`li[lily-breadcrumb-list-item]`):
// its host is the native <li> the consumer writes, not a wrapper element, so tests mount
// it via a small host template rather than `TestBed.createComponent(BreadcrumbListItem)`
// directly (the latter has no `<li>` to attach to and falls back to a bare <div>).
@Component({
  standalone: true,
  imports: [BreadcrumbListItem],
  template: `<li lily-breadcrumb-list-item [className]="className">Home</li>`,
})
class TestHost {
  className = "";
}

describe("BreadcrumbListItem", () => {
  test("the host is the li itself — no wrapper element — with the base class", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li");
    expect(el.tagName).toBe("LI");
    expect(el.classList.contains("breadcrumb-list-item")).toBe(true);
  });

  test("appends the className input to the host class list", () => {
    const fixture = TestBed.createComponent(TestHost);
    fixture.componentInstance.className = "extra";
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li");
    expect(el.classList.contains("extra")).toBe(true);
  });

  test("nests directly under the ol rendered by BreadcrumbList — no wrapper element between them", () => {
    @Component({
      standalone: true,
      imports: [BreadcrumbList, BreadcrumbListItem],
      template: `<lily-breadcrumb-list>
        <li lily-breadcrumb-list-item>Home</li>
        <li lily-breadcrumb-list-item>Page</li>
      </lily-breadcrumb-list>`,
    })
    class ListTestHost {}

    const fixture = TestBed.createComponent(ListTestHost);
    fixture.detectChanges();
    const ol = fixture.nativeElement.querySelector("ol.breadcrumb-list");
    expect(ol).toBeTruthy();
    expect(ol.children.length).toBe(2);
    expect(Array.from(ol.children as HTMLCollection).every((child) => (child as HTMLElement).tagName === "LI")).toBe(true);
  });
});

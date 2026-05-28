import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AccordionListItem } from "./AccordionListItem";

describe("AccordionListItem", () => {
  test("renders the li root with the base class", () => {
    const fixture = TestBed.createComponent(AccordionListItem);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li.accordion-list-item");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(AccordionListItem);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("li.accordion-list-item");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

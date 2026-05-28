import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { RelatedContent } from "./RelatedContent";

describe("RelatedContent", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(RelatedContent);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.related-content");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(RelatedContent);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.related-content");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

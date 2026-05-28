import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AlbaCommunityHealthIndexView } from "./AlbaCommunityHealthIndexView";

describe("AlbaCommunityHealthIndexView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(AlbaCommunityHealthIndexView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.alba-community-health-index-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(AlbaCommunityHealthIndexView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.alba-community-health-index-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AlbaCommunityHealthIndexInput } from "./AlbaCommunityHealthIndexInput";

describe("AlbaCommunityHealthIndexInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(AlbaCommunityHealthIndexInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.alba-community-health-index-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(AlbaCommunityHealthIndexInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.alba-community-health-index-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TagGroup } from "./TagGroup";

describe("TagGroup", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(TagGroup);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.tag-group");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TagGroup);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.tag-group");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

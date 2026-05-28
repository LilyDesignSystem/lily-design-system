import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Tag } from "./Tag";

describe("Tag", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Tag);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.tag");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Tag);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.tag");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

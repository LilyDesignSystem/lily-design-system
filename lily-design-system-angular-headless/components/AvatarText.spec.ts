import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AvatarText } from "./AvatarText";

describe("AvatarText", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(AvatarText);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.avatar-text");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(AvatarText);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.avatar-text");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

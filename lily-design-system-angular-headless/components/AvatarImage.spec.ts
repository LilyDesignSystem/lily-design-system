import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AvatarImage } from "./AvatarImage";

describe("AvatarImage", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(AvatarImage);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.avatar-image");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(AvatarImage);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.avatar-image");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

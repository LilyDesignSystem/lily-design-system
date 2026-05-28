import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AnnouncementBanner } from "./AnnouncementBanner";

describe("AnnouncementBanner", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(AnnouncementBanner);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.announcement-banner");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(AnnouncementBanner);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.announcement-banner");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

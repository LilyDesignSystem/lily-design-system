import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { StatusTag } from "./StatusTag";

describe("StatusTag", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(StatusTag);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.status-tag");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(StatusTag);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.status-tag");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

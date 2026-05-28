import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Container } from "./Container";

describe("Container", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(Container);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.container");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(Container);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.container");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

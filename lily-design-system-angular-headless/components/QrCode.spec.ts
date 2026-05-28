import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { QrCode } from "./QrCode";

describe("QrCode", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(QrCode);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.qr-code");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(QrCode);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.qr-code");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

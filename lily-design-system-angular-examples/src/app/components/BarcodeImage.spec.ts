import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { BarcodeImage } from "./BarcodeImage";

describe("BarcodeImage", () => {
  test("renders the img root with the base class", () => {
    const fixture = TestBed.createComponent(BarcodeImage);
    fixture.componentRef.setInput("src", "data:image/png;base64,iVBORw0KGgo=");
    fixture.componentRef.setInput("alt", "Order number 12345");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("img.barcode-image");
    expect(el).toBeTruthy();
    expect(el.getAttribute("alt")).toBe("Order number 12345");
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(BarcodeImage);
    fixture.componentRef.setInput("src", "data:image/png;base64,iVBORw0KGgo=");
    fixture.componentRef.setInput("alt", "Sample");
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("img.barcode-image");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

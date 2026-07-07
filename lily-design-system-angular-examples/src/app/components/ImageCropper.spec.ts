import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ImageCropper } from "./ImageCropper";

describe("ImageCropper", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ImageCropper);
    fixture.componentRef.setInput("label", "Crop image");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.image-cropper");
    expect(el).toBeTruthy();
  });

  test("sets role=application on the root", () => {
    const fixture = TestBed.createComponent(ImageCropper);
    fixture.componentRef.setInput("label", "Crop image");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.image-cropper");
    expect(el.getAttribute("role")).toBe("application");
  });

  test("reflects the label input as aria-label", () => {
    const fixture = TestBed.createComponent(ImageCropper);
    fixture.componentRef.setInput("label", "Crop avatar");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.image-cropper");
    expect(el.getAttribute("aria-label")).toBe("Crop avatar");
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ImageCropper);
    fixture.componentRef.setInput("label", "Crop image");
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.image-cropper");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

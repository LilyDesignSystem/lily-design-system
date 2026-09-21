import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { IconButton } from "./IconButton";

describe("IconButton", () => {
  test("renders the button root with the base class", () => {
    const fixture = TestBed.createComponent(IconButton);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.icon-button");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(IconButton);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button.icon-button");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });

  test("baseClass replaces the default class token outright", () => {
    const fixture = TestBed.createComponent(IconButton);
    fixture.componentRef.setInput("baseClass", "theme-picker-button");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button");
    expect(el.className.trim()).toBe("theme-picker-button");
    expect(fixture.nativeElement.querySelector(".icon-button")).toBeNull();
  });

  test("the host tag is display: contents", () => {
    const fixture = TestBed.createComponent(IconButton);
    fixture.detectChanges();
    expect(fixture.nativeElement.style.display).toBe("contents");
  });

  test("aria-haspopup / aria-expanded / aria-controls pass through to the real button", () => {
    const fixture = TestBed.createComponent(IconButton);
    fixture.componentRef.setInput("ariaHaspopup", "listbox");
    fixture.componentRef.setInput("ariaExpanded", false);
    fixture.componentRef.setInput("ariaControls", "some-list");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("button");
    expect(el.getAttribute("aria-haspopup")).toBe("listbox");
    expect(el.getAttribute("aria-expanded")).toBe("false");
    expect(el.getAttribute("aria-controls")).toBe("some-list");
  });

  test("focus() focuses the real button", () => {
    const fixture = TestBed.createComponent(IconButton);
    fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement);
    fixture.componentInstance.focus();
    const el = fixture.nativeElement.querySelector("button");
    expect(document.activeElement).toBe(el);
    fixture.nativeElement.remove();
  });

  test("element getter exposes the real button", () => {
    const fixture = TestBed.createComponent(IconButton);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector("button");
    expect(fixture.componentInstance.element).toBe(button);
  });
});

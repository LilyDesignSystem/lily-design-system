import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TransferList } from "./TransferList";

describe("TransferList", () => {
  test("renders the ol root with the base class", () => {
    const fixture = TestBed.createComponent(TransferList);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ol.transfer-list");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TransferList);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("ol.transfer-list");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

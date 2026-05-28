import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { SlovenijaEmsoView } from "./SlovenijaEmsoView";

describe("SlovenijaEmsoView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(SlovenijaEmsoView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.slovenija-emso-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(SlovenijaEmsoView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.slovenija-emso-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

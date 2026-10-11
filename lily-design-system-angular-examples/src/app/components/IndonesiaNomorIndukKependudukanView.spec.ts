import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { IndonesiaNomorIndukKependudukanView } from "./IndonesiaNomorIndukKependudukanView";

describe("IndonesiaNomorIndukKependudukanView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(IndonesiaNomorIndukKependudukanView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.indonesia-nomor-induk-kependudukan-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(IndonesiaNomorIndukKependudukanView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.indonesia-nomor-induk-kependudukan-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

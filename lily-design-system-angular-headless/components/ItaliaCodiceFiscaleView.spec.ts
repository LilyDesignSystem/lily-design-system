import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ItaliaCodiceFiscaleView } from "./ItaliaCodiceFiscaleView";

describe("ItaliaCodiceFiscaleView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(ItaliaCodiceFiscaleView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.italia-codice-fiscale-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ItaliaCodiceFiscaleView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.italia-codice-fiscale-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

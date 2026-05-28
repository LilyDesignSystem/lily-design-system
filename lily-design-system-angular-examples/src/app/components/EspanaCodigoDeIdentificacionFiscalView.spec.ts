import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { EspanaCodigoDeIdentificacionFiscalView } from "./EspanaCodigoDeIdentificacionFiscalView";

describe("EspanaCodigoDeIdentificacionFiscalView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(EspanaCodigoDeIdentificacionFiscalView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.espana-codigo-de-identificacion-fiscal-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(EspanaCodigoDeIdentificacionFiscalView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.espana-codigo-de-identificacion-fiscal-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

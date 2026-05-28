import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { EspanaCodigoDeIdentificacionFiscalInput } from "./EspanaCodigoDeIdentificacionFiscalInput";

describe("EspanaCodigoDeIdentificacionFiscalInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(EspanaCodigoDeIdentificacionFiscalInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.espana-codigo-de-identificacion-fiscal-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(EspanaCodigoDeIdentificacionFiscalInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.espana-codigo-de-identificacion-fiscal-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

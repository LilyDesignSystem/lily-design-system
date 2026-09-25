import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ArgentinaCodigoUnicoDeIdentificacionLaboralInput } from "./ArgentinaCodigoUnicoDeIdentificacionLaboralInput";

describe("ArgentinaCodigoUnicoDeIdentificacionLaboralInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(ArgentinaCodigoUnicoDeIdentificacionLaboralInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.argentina-codigo-unico-de-identificacion-laboral-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ArgentinaCodigoUnicoDeIdentificacionLaboralInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.argentina-codigo-unico-de-identificacion-laboral-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

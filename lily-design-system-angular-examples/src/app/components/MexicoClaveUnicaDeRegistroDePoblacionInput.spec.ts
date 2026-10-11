import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MexicoClaveUnicaDeRegistroDePoblacionInput } from "./MexicoClaveUnicaDeRegistroDePoblacionInput";

describe("MexicoClaveUnicaDeRegistroDePoblacionInput", () => {
  test("renders the input root with the base class", () => {
    const fixture = TestBed.createComponent(MexicoClaveUnicaDeRegistroDePoblacionInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.mexico-clave-unica-de-registro-de-poblacion-input");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(MexicoClaveUnicaDeRegistroDePoblacionInput);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.mexico-clave-unica-de-registro-de-poblacion-input");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });

  test("sets autocomplete to off", () => {
    const fixture = TestBed.createComponent(MexicoClaveUnicaDeRegistroDePoblacionInput);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.mexico-clave-unica-de-registro-de-poblacion-input");
    expect(el.getAttribute("autocomplete")).toBe("off");
  });

  test("sets aria-label from the label input", () => {
    const fixture = TestBed.createComponent(MexicoClaveUnicaDeRegistroDePoblacionInput);
    fixture.componentRef.setInput("label", "Hello");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.mexico-clave-unica-de-registro-de-poblacion-input");
    expect(el.getAttribute("aria-label")).toBe("Hello");
  });

  test("reflects the required input", () => {
    const fixture = TestBed.createComponent(MexicoClaveUnicaDeRegistroDePoblacionInput);
    fixture.componentRef.setInput("required", true);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.mexico-clave-unica-de-registro-de-poblacion-input");
    expect(el.required).toBe(true);
  });

  test("reflects the disabled input", () => {
    const fixture = TestBed.createComponent(MexicoClaveUnicaDeRegistroDePoblacionInput);
    fixture.componentRef.setInput("disabled", true);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.mexico-clave-unica-de-registro-de-poblacion-input");
    expect(el.disabled).toBe(true);
  });

  test("supports two-way binding of value", () => {
    const fixture = TestBed.createComponent(MexicoClaveUnicaDeRegistroDePoblacionInput);
    fixture.componentRef.setInput("value", "abc123");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("input.mexico-clave-unica-de-registro-de-poblacion-input");
    expect(el.value).toBe("abc123");
  });
});

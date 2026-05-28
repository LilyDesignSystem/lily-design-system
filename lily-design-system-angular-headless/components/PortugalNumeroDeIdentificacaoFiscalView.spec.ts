import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { PortugalNumeroDeIdentificacaoFiscalView } from "./PortugalNumeroDeIdentificacaoFiscalView";

describe("PortugalNumeroDeIdentificacaoFiscalView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(PortugalNumeroDeIdentificacaoFiscalView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.portugal-numero-de-identificacao-fiscal-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(PortugalNumeroDeIdentificacaoFiscalView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.portugal-numero-de-identificacao-fiscal-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

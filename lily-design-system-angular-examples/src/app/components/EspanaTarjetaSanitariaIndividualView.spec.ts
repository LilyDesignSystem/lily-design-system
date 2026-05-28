import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { EspanaTarjetaSanitariaIndividualView } from "./EspanaTarjetaSanitariaIndividualView";

describe("EspanaTarjetaSanitariaIndividualView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(EspanaTarjetaSanitariaIndividualView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.espana-tarjeta-sanitaria-individual-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(EspanaTarjetaSanitariaIndividualView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.espana-tarjeta-sanitaria-individual-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { PolskaNumerIdentyfikacjiPodatkowejView } from "./PolskaNumerIdentyfikacjiPodatkowejView";

describe("PolskaNumerIdentyfikacjiPodatkowejView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(PolskaNumerIdentyfikacjiPodatkowejView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.polska-numer-identyfikacji-podatkowej-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(PolskaNumerIdentyfikacjiPodatkowejView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.polska-numer-identyfikacji-podatkowej-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

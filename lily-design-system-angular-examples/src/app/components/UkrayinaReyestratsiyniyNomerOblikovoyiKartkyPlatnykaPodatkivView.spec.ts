import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView } from "./UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView";

describe("UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView", () => {
  test("renders the span root with the base class", () => {
    const fixture = TestBed.createComponent(UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("span.ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

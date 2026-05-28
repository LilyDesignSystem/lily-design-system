import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TileMap } from "./TileMap";

describe("TileMap", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(TileMap);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.tile-map");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(TileMap);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.tile-map");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ProductCard } from "./ProductCard";

describe("ProductCard", () => {
  test("renders the div root with the base class", () => {
    const fixture = TestBed.createComponent(ProductCard);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.product-card");
    expect(el).toBeTruthy();
  });

  test("appends the className input to the root class list", () => {
    const fixture = TestBed.createComponent(ProductCard);
    fixture.componentRef.setInput("className", "extra");
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector("div.product-card");
    expect(el).toBeTruthy();
    expect(el.classList.contains("extra")).toBe(true);
  });
});

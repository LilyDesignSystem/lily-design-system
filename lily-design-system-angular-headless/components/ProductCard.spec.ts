import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ProductCard } from "./ProductCard";

describe("ProductCard", () => {
    test("renders the <article> root with the base class", () => {
        const fixture = TestBed.createComponent(ProductCard);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("article.product-card");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(ProductCard);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("article.product-card");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("renders its content", () => {
        const fixture = TestBed.createComponent(ProductCard);
        fixture.componentRef.setInput("name", "Tulip");
        fixture.componentRef.setInput("price", "\u20ac3");
        fixture.componentRef.setInput("imageUrl", "/a.png");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".product-card");
        expect(el.getAttribute("aria-label")).toBe("Tulip");
        expect(el.querySelector(".product-card-name").textContent).toBe("Tulip");
        expect(el.querySelector(".product-card-price").textContent).toBe("€3");
        expect(el.querySelector(".product-card-image").getAttribute("alt")).toBe("");
    });
});

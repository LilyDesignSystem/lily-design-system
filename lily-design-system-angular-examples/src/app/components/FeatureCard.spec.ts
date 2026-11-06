import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FeatureCard } from "./FeatureCard";

describe("FeatureCard", () => {
    test("renders the <article> root with the base class", () => {
        const fixture = TestBed.createComponent(FeatureCard);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("article.feature-card");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(FeatureCard);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("article.feature-card");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("renders its content", () => {
        const fixture = TestBed.createComponent(FeatureCard);
        fixture.componentRef.setInput("heading", "Fast");
        fixture.componentRef.setInput("imagePosition", "top");
        fixture.componentRef.setInput("imageUrl", "/a.png");
        fixture.componentRef.setInput("description", "Very");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".feature-card");
        expect(el.getAttribute("aria-label")).toBe("Fast");
        expect(el.getAttribute("data-image-position")).toBe("top");
        expect(el.querySelector(".feature-card-heading").textContent).toBe("Fast");
        expect(el.querySelector(".feature-card-image").getAttribute("alt")).toBe("");
        expect(el.querySelector(".feature-card-description").textContent).toBe("Very");
    });
});

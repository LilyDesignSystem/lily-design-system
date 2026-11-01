import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { HongKongIdentityCardView } from "./HongKongIdentityCardView";

describe("HongKongIdentityCardView", () => {
    test("renders the span root with the base class", () => {
        const fixture = TestBed.createComponent(HongKongIdentityCardView);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.hong-kong-identity-card-view");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(HongKongIdentityCardView);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.hong-kong-identity-card-view");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

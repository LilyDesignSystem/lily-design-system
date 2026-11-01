import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { HongKongIdentityCardInput } from "./HongKongIdentityCardInput";

describe("HongKongIdentityCardInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(HongKongIdentityCardInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.hong-kong-identity-card-input");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(HongKongIdentityCardInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.hong-kong-identity-card-input");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

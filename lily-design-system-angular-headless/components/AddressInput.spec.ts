import { Component } from "@angular/core";
import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AddressInput } from "./AddressInput";

@Component({
    standalone: true,
    imports: [AddressInput],
    template: `<lily-address-input label="Delivery address">
        <label for="street">Street</label><input id="street" autocomplete="address-line1" />
    </lily-address-input>`,
})
class Host {}

describe("AddressInput", () => {
    test("renders a group root with the base class", () => {
        const fixture = TestBed.createComponent(AddressInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.address-input");
        expect(el).toBeTruthy();
        expect(el.getAttribute("role")).toBe("group");
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(AddressInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.address-input");
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is named by label and holds the consumer's fields", () => {
        const fixture = TestBed.createComponent(Host);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".address-input");
        expect(el.getAttribute("aria-label")).toBe("Delivery address");
        expect(el.querySelector("input#street")).toBeTruthy();
    });
});

import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { QrCodeImage } from "./QrCodeImage";

describe("QrCodeImage", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(QrCodeImage);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.qr-code-image");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(QrCodeImage);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.qr-code-image");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=img, as in Svelte", () => {
        const fixture = TestBed.createComponent(QrCodeImage);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".qr-code-image");
        expect(el.getAttribute("role")).toBe("img");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });
});

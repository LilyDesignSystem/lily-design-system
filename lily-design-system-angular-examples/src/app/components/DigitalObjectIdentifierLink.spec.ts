import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DigitalObjectIdentifierLink } from "./DigitalObjectIdentifierLink";

describe("DigitalObjectIdentifierLink", () => {
    test("renders the a root with the base class", () => {
        const fixture = TestBed.createComponent(DigitalObjectIdentifierLink);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("a.digital-object-identifier-link");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(DigitalObjectIdentifierLink);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("a.digital-object-identifier-link");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("links to the resolver and shows the identifier", () => {
        const fixture = TestBed.createComponent(DigitalObjectIdentifierLink);
        fixture.componentRef.setInput("doi", "10.1000/182");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("a");
        expect(el.getAttribute("href")).toBe("https://doi.org/10.1000/182");
        expect(el.getAttribute("rel")).toBe("noopener noreferrer");
        expect(el.textContent).toBe("10.1000/182");
    });
});

import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ProgressCircle } from "./ProgressCircle";

describe("ProgressCircle", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(ProgressCircle);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.progress-circle");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(ProgressCircle);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.progress-circle");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("exposes its value as a progressbar", () => {
        const fixture = TestBed.createComponent(ProgressCircle);
        fixture.componentRef.setInput("label", "Upload");
        fixture.componentRef.setInput("value", 40);
        fixture.componentRef.setInput("max", 80);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".progress-circle");
        expect(el.getAttribute("role")).toBe("progressbar");
        expect(el.getAttribute("aria-label")).toBe("Upload");
        expect(el.getAttribute("aria-valuenow")).toBe("40");
        expect(el.getAttribute("aria-valuemin")).toBe("0");
        expect(el.getAttribute("aria-valuemax")).toBe("80");
    });
});

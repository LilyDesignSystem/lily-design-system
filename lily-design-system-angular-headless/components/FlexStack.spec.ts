import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FlexStack } from "./FlexStack";

describe("FlexStack", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(FlexStack);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.flex-stack");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(FlexStack);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.flex-stack");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("never names its root", () => {
        const fixture = TestBed.createComponent(FlexStack);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".flex-stack");
        expect(el.hasAttribute("aria-label")).toBe(false);
        expect(el.hasAttribute("role")).toBe(false);
    });

    test("lays out its items", () => {
        const fixture = TestBed.createComponent(FlexStack);
        fixture.componentRef.setInput("direction", "row");
        fixture.componentRef.setInput("gap", "2rem");
        fixture.componentRef.setInput("align", "center");
        fixture.componentRef.setInput("justify", "end");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".flex-stack");
        expect(el.getAttribute("data-direction")).toBe("row");
        expect(el.style.display).toBe("flex");
        expect(el.style.flexDirection).toBe("row");
        expect(el.style.gap).toBe("2rem");
        expect(el.style.alignItems).toBe("center");
        expect(el.style.justifyContent).toBe("end");
    });
});

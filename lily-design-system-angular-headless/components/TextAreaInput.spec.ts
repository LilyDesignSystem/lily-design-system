import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TextAreaInput } from "./TextAreaInput";

describe("TextAreaInput", () => {
    test("renders the <textarea> root with the base class", () => {
        const fixture = TestBed.createComponent(TextAreaInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("textarea.text-area-input");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(TextAreaInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("textarea.text-area-input");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is a textarea that writes typed text to the value model, with rows", () => {
        const fixture = TestBed.createComponent(TextAreaInput);
        fixture.componentRef.setInput("rows", 4);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("textarea.text-area-input");
        expect(el.getAttribute("rows")).toBe("4");
        el.value = "line one\nline two";
        el.dispatchEvent(new Event("input"));
        expect(fixture.componentInstance.value()).toBe("line one\nline two");
    });
});

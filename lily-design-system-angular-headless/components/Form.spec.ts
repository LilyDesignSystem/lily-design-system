import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Form } from "./Form";

describe("Form", () => {
    test("renders the <form> root with the base class", () => {
        const fixture = TestBed.createComponent(Form);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("form.form");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Form);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("form.form");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("prevents the native submission and emits submitted", () => {
        const fixture = TestBed.createComponent(Form);
        fixture.detectChanges();
        const events: SubmitEvent[] = [];
        fixture.componentInstance.submitted.subscribe((e) => events.push(e));
        const form = fixture.nativeElement.querySelector("form.form");
        const event = new Event("submit", { cancelable: true });
        form.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        expect(events).toEqual([event]);
    });

    test("names the root with aria-label from the label input", () => {
        const fixture = TestBed.createComponent(Form);
        fixture.componentRef.setInput("label", "Named");
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector("form.form").getAttribute("aria-label")).toBe(
            "Named",
        );
    });
});

import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { DataFilterForm } from "./DataFilterForm";

describe("DataFilterForm", () => {
    test("renders the <form> root with the base class", () => {
        const fixture = TestBed.createComponent(DataFilterForm);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("form.data-filter-form");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(DataFilterForm);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("form.data-filter-form");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("prevents the native submission and emits submitted", () => {
        const fixture = TestBed.createComponent(DataFilterForm);
        fixture.detectChanges();
        const events: SubmitEvent[] = [];
        fixture.componentInstance.submitted.subscribe((e) => events.push(e));
        const form = fixture.nativeElement.querySelector("form.data-filter-form");
        const event = new Event("submit", { cancelable: true });
        form.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        expect(events).toEqual([event]);
    });
});

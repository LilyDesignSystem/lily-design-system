import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { NewsletterSignup } from "./NewsletterSignup";

describe("NewsletterSignup", () => {
    test("renders the <form> root with the base class", () => {
        const fixture = TestBed.createComponent(NewsletterSignup);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("form.newsletter-signup");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(NewsletterSignup);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("form.newsletter-signup");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("prevents the native submission and emits submitted", () => {
        const fixture = TestBed.createComponent(NewsletterSignup);
        fixture.detectChanges();
        const events: SubmitEvent[] = [];
        fixture.componentInstance.submitted.subscribe((e) => events.push(e));
        const form = fixture.nativeElement.querySelector("form.newsletter-signup");
        const event = new Event("submit", { cancelable: true });
        form.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        expect(events).toEqual([event]);
    });
});

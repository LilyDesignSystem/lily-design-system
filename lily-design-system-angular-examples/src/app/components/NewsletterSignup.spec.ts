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

    test("renders its form", () => {
        const fixture = TestBed.createComponent(NewsletterSignup);
        fixture.componentRef.setInput("heading", "News");
        fixture.componentRef.setInput("emailLabel", "Email");
        fixture.componentRef.setInput("submitLabel", "Join");
        fixture.componentRef.setInput("emailPlaceholder", "you@example.org");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".newsletter-signup");
        expect(el.querySelector(".newsletter-signup-heading").textContent).toBe("News");
        expect(el.querySelector(".newsletter-signup-label").textContent).toContain("Email");
        expect(el.querySelector(".newsletter-signup-input").getAttribute("placeholder")).toBe(
            "you@example.org",
        );
        expect(el.querySelector(".newsletter-signup-submit").textContent).toBe("Join");
    });

    test("disables itself while submitting", () => {
        const fixture = TestBed.createComponent(NewsletterSignup);
        fixture.componentRef.setInput("state", "submitting");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".newsletter-signup");
        expect(el.getAttribute("data-state")).toBe("submitting");
        expect(el.querySelector("input").disabled).toBe(true);
        expect(el.querySelector("button").disabled).toBe(true);
    });

    test("shows the message for its state", () => {
        const fixture = TestBed.createComponent(NewsletterSignup);
        fixture.componentRef.setInput("state", "error");
        fixture.componentRef.setInput("errorMessage", "Failed");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".newsletter-signup");
        expect(el.querySelector(".newsletter-signup-error").hidden).toBe(false);
        expect(el.querySelector(".newsletter-signup-error").textContent).toBe("Failed");
        expect(el.querySelector(".newsletter-signup-success").hidden).toBe(true);
    });
});

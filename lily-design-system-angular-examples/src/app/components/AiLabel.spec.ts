import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { AiLabel } from "./AiLabel";

describe("AiLabel", () => {
    test("renders the <span> root with the base class", () => {
        const fixture = TestBed.createComponent(AiLabel);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.ai-label");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(AiLabel);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.ai-label");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=img with a label", () => {
        const fixture = TestBed.createComponent(AiLabel);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".ai-label");
        expect(el.getAttribute("role")).toBe("img");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });

    test("shows its text", () => {
        const fixture = TestBed.createComponent(AiLabel);
        fixture.componentRef.setInput("text", "AI");
        fixture.componentRef.setInput("label", "Made with AI");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".ai-label");
        expect(el.textContent).toBe("AI");
    });
});

import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Button } from "./Button";

describe("Button", () => {
    test("renders the button root with the base class", () => {
        const fixture = TestBed.createComponent(Button);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("button.button");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Button);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("button.button");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("is type=button and enabled by default, and not a toggle", () => {
        const fixture = TestBed.createComponent(Button);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("button");
        expect(el.getAttribute("type")).toBe("button");
        expect(el.disabled).toBe(false);
        expect(el.hasAttribute("aria-pressed")).toBe(false);
    });

    test("takes type, disabled and pressed", () => {
        const fixture = TestBed.createComponent(Button);
        fixture.componentRef.setInput("type", "submit");
        fixture.componentRef.setInput("disabled", true);
        fixture.componentRef.setInput("pressed", false);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("button");
        expect(el.getAttribute("type")).toBe("submit");
        expect(el.disabled).toBe(true);
        expect(el.getAttribute("aria-pressed")).toBe("false");
    });

    test("a pending button keeps focus and a consumer guard ignores a second click", () => {
        const fixture = TestBed.createComponent(Button);
        fixture.componentRef.setInput("ariaBusy", true);
        fixture.componentRef.setInput("ariaDisabled", true);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("button") as HTMLButtonElement;
        let pending = false;
        let starts = 0;
        el.addEventListener("click", () => {
            if (pending) return;
            pending = true;
            starts += 1;
        });

        el.focus();
        el.click();
        el.click();

        expect(el.disabled).toBe(false);
        expect(el.getAttribute("aria-busy")).toBe("true");
        expect(el.getAttribute("aria-disabled")).toBe("true");
        expect(document.activeElement).toBe(el);
        expect(starts).toBe(1);
    });
});

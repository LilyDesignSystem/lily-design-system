import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { HamburgerMenu } from "./HamburgerMenu";

describe("HamburgerMenu", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(HamburgerMenu);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.hamburger-menu");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(HamburgerMenu);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.hamburger-menu");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    function rendered(label = "Main menu") {
        const fixture = TestBed.createComponent(HamburgerMenu);
        fixture.componentRef.setInput("label", label);
        fixture.detectChanges();
        return { fixture, root: fixture.nativeElement as HTMLElement };
    }

    test("the toggle is a named button linked to the navigation", async () => {
        const { fixture, root } = rendered();
        const button = root.querySelector("button")!;
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("aria-label")).toBe("Main menu");
        expect(button.textContent?.trim()).toBe("Main menu");
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(root.querySelector("nav")).toBeNull();

        button.click();
        fixture.detectChanges();
        await fixture.whenStable();
        const nav = root.querySelector("nav")!;
        expect(button.getAttribute("aria-expanded")).toBe("true");
        expect(nav.getAttribute("aria-label")).toBe("Main menu");
        expect(nav.id).toBe(button.getAttribute("aria-controls"));
    });

    test("a second click closes it, and open is two-way", async () => {
        const { fixture, root } = rendered();
        const seen: boolean[] = [];
        fixture.componentInstance.open.subscribe((v) => seen.push(v));
        const button = root.querySelector("button")!;
        button.click();
        fixture.detectChanges();
        button.click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(seen).toEqual([true, false]);
        expect(root.querySelector("nav")).toBeNull();
        expect(button.getAttribute("aria-expanded")).toBe("false");
    });

    test("the open input opens it", async () => {
        const fixture = TestBed.createComponent(HamburgerMenu);
        fixture.componentRef.setInput("label", "Main menu");
        fixture.componentRef.setInput("open", true);
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector("nav")).toBeTruthy();
    });

    test("two menus have different ids", () => {
        const a = rendered().root.querySelector("button")!;
        const b = rendered().root.querySelector("button")!;
        expect(a.getAttribute("aria-controls")).not.toBe(b.getAttribute("aria-controls"));
    });
});

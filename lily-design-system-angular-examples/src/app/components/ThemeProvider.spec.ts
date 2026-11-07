import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { ThemeProvider } from "./ThemeProvider";

describe("ThemeProvider", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(ThemeProvider);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.theme-provider");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(ThemeProvider);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.theme-provider");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("flattens the theme into custom properties", () => {
        const fixture = TestBed.createComponent(ThemeProvider);
        fixture.componentRef.setInput("theme", {
            color: { primary: "#2563eb" },
            space: { md: "1rem" },
        });
        fixture.componentRef.setInput("base", "dark");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".theme-provider");
        expect(el.getAttribute("data-theme")).toBe("dark");
        expect(el.style.display).toBe("contents");
        expect(el.style.getPropertyValue("--theme-color-primary")).toBe("#2563eb");
        expect(el.style.getPropertyValue("--theme-space-md")).toBe("1rem");
    });
});

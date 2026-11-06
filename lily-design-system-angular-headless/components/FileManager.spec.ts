import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { FileManager } from "./FileManager";

describe("FileManager", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(FileManager);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.file-manager");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(FileManager);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.file-manager");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=region, as in Svelte", () => {
        const fixture = TestBed.createComponent(FileManager);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".file-manager");
        expect(el.getAttribute("role")).toBe("region");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });
});

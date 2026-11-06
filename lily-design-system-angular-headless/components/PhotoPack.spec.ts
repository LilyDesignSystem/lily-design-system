import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { PhotoPack } from "./PhotoPack";

describe("PhotoPack", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(PhotoPack);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.photo-pack");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(PhotoPack);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.photo-pack");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=group, as in Svelte", () => {
        const fixture = TestBed.createComponent(PhotoPack);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".photo-pack");
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });
});

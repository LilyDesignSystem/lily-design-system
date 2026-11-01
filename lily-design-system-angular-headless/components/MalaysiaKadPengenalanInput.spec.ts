import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { MalaysiaKadPengenalanInput } from "./MalaysiaKadPengenalanInput";

describe("MalaysiaKadPengenalanInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(MalaysiaKadPengenalanInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.malaysia-kad-pengenalan-input");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(MalaysiaKadPengenalanInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.malaysia-kad-pengenalan-input");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

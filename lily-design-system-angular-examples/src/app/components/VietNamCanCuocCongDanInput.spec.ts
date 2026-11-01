import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { VietNamCanCuocCongDanInput } from "./VietNamCanCuocCongDanInput";

describe("VietNamCanCuocCongDanInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(VietNamCanCuocCongDanInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.viet-nam-can-cuoc-cong-dan-input");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(VietNamCanCuocCongDanInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("input.viet-nam-can-cuoc-cong-dan-input");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

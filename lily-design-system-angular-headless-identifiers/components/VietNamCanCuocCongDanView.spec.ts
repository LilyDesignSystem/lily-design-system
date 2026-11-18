import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { VietNamCanCuocCongDanView } from "./VietNamCanCuocCongDanView";

describe("VietNamCanCuocCongDanView", () => {
    test("renders the span root with the base class", () => {
        const fixture = TestBed.createComponent(VietNamCanCuocCongDanView);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.viet-nam-can-cuoc-cong-dan-view");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(VietNamCanCuocCongDanView);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("span.viet-nam-can-cuoc-cong-dan-view");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

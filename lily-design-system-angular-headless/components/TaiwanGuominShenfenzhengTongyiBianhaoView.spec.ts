import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TaiwanGuominShenfenzhengTongyiBianhaoView } from "./TaiwanGuominShenfenzhengTongyiBianhaoView";

describe("TaiwanGuominShenfenzhengTongyiBianhaoView", () => {
    test("renders the span root with the base class", () => {
        const fixture = TestBed.createComponent(TaiwanGuominShenfenzhengTongyiBianhaoView);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "span.taiwan-guomin-shenfenzheng-tongyi-bianhao-view",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(TaiwanGuominShenfenzhengTongyiBianhaoView);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "span.taiwan-guomin-shenfenzheng-tongyi-bianhao-view",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

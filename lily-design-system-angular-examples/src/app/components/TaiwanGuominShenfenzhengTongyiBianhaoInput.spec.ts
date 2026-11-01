import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { TaiwanGuominShenfenzhengTongyiBianhaoInput } from "./TaiwanGuominShenfenzhengTongyiBianhaoInput";

describe("TaiwanGuominShenfenzhengTongyiBianhaoInput", () => {
    test("renders the input root with the base class", () => {
        const fixture = TestBed.createComponent(TaiwanGuominShenfenzhengTongyiBianhaoInput);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.taiwan-guomin-shenfenzheng-tongyi-bianhao-input",
        );
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(TaiwanGuominShenfenzhengTongyiBianhaoInput);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(
            "input.taiwan-guomin-shenfenzheng-tongyi-bianhao-input",
        );
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });
});

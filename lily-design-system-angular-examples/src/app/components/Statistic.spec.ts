import { describe, expect, test } from "vitest";
import { TestBed } from "@angular/core/testing";

import { Statistic } from "./Statistic";

describe("Statistic", () => {
    test("renders the div root with the base class", () => {
        const fixture = TestBed.createComponent(Statistic);
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.statistic");
        expect(el).toBeTruthy();
    });

    test("appends the className input to the root class list", () => {
        const fixture = TestBed.createComponent(Statistic);
        fixture.componentRef.setInput("className", "extra");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector("div.statistic");
        expect(el).toBeTruthy();
        expect(el.classList.contains("extra")).toBe(true);
    });

    test("has role=group, as in Svelte", () => {
        const fixture = TestBed.createComponent(Statistic);
        fixture.componentRef.setInput("label", "Story");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".statistic");
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Story");
    });

    test("names itself from its content", () => {
        const fixture = TestBed.createComponent(Statistic);
        fixture.componentRef.setInput("title", "Users");
        fixture.componentRef.setInput("value", "12");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".statistic");
        expect(el.getAttribute("aria-label")).toBe("Users: 12");
        expect(el.querySelector(".statistic-title").textContent).toBe("Users");
        expect(el.querySelector(".statistic-value").textContent).toBe("12");
        expect(fixture.nativeElement.hasAttribute("title")).toBe(false);
    });

    test("prefers its label", () => {
        const fixture = TestBed.createComponent(Statistic);
        fixture.componentRef.setInput("label", "Twelve users");
        fixture.detectChanges();
        const el = fixture.nativeElement.querySelector(".statistic");
        expect(el.getAttribute("aria-label")).toBe("Twelve users");
    });
});

describe("Statistic — change and as of", () => {
    function create(inputs: Record<string, unknown>) {
        const fixture = TestBed.createComponent(Statistic);
        for (const [k, v] of Object.entries({ title: "Index", value: "30.5", ...inputs }))
            fixture.componentRef.setInput(k, v);
        fixture.detectChanges();
        return fixture.nativeElement as HTMLElement;
    }

    test("a change is text that names its comparison, with the direction as data-trend", () => {
        const root = create({ change: "0.5 more than October 2024", trend: "up" });
        const change = root.querySelector(".statistic-change") as HTMLElement;
        expect(change.textContent).toBe("0.5 more than October 2024");
        expect(change.getAttribute("data-trend")).toBe("up");
        expect(root.textContent).not.toMatch(/[↑↓→]/);
    });

    test("the as-of line is a time element, shown only with its words", () => {
        expect(create({ asOf: "2024-12-01" }).querySelector(".statistic-as-of")).toBeNull();
        const time = create({
            asOf: "2024-12-01",
            asOfLabel: "Data as of 1 December 2024",
        }).querySelector("time.statistic-as-of") as HTMLElement;
        expect(time.getAttribute("datetime")).toBe("2024-12-01");
        expect(time.textContent).toBe("Data as of 1 December 2024");
    });

    test("without a change there is no change part and no data-trend", () => {
        const root = create({ trend: "down" });
        expect(root.querySelector(".statistic-change")).toBeNull();
        expect(root.querySelector("[data-trend]")).toBeNull();
    });
});

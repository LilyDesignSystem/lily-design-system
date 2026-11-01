import { afterEach, describe, expect, test, vi } from "vitest";
import { Component, signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { DateTimeNowInput } from "./DateTimeNowInput";

describe("DateTimeNowInput", () => {
    afterEach(() => vi.useRealTimers());

    function render(inputs: Record<string, unknown> = {}) {
        const fixture = TestBed.createComponent(DateTimeNowInput);
        for (const [k, v] of Object.entries({
            label: "Appointment",
            dateLabel: "Fecha",
            timeLabel: "Hora",
            nowLabel: "Ahora",
            ...inputs,
        }))
            fixture.componentRef.setInput(k, v);
        fixture.detectChanges();
        return fixture;
    }
    const parts = (f: ReturnType<typeof render>) => {
        const root = f.nativeElement.querySelector("div.date-time-now-input");
        return {
            root,
            date: root.querySelector('input[type="date"]'),
            time: root.querySelector('input[type="time"]'),
            now: root.querySelector("button"),
        };
    };

    test("renders a labelled group div with the base class and className", () => {
        const { root } = parts(render({ className: "extra" }));
        expect(root.getAttribute("role")).toBe("group");
        expect(root.getAttribute("aria-label")).toBe("Appointment");
        expect(root.classList.contains("extra")).toBe(true);
    });

    test("names the date input, time input and Now button", () => {
        const { date, time, now } = parts(
            render({ dateLabel: "Fecha", timeLabel: "Hora", nowLabel: "Ahora" }),
        );
        expect(date.getAttribute("aria-label")).toBe("Fecha");
        expect(time.getAttribute("aria-label")).toBe("Hora");
        expect(now.getAttribute("aria-label")).toBe("Ahora");
        expect(now.textContent.trim()).toBe("Ahora");
        expect(now.type).toBe("button");
    });

    test("shows and writes back both values", () => {
        const fixture = render({ dateValue: "2026-01-02", timeValue: "03:04" });
        const { date, time } = parts(fixture);
        expect(date.value).toBe("2026-01-02");
        expect(time.value).toBe("03:04");
        date.value = "2026-05-06";
        date.dispatchEvent(new Event("input"));
        time.value = "07:08";
        time.dispatchEvent(new Event("input"));
        expect(fixture.componentInstance.dateValue()).toBe("2026-05-06");
        expect(fixture.componentInstance.timeValue()).toBe("07:08");
    });

    test("Now sets both to the current local date and time", () => {
        vi.useFakeTimers({ toFake: ["Date"] });
        vi.setSystemTime(new Date(2026, 9, 31, 9, 5));
        const fixture = render();
        const { date, time, now } = parts(fixture);
        now.click();
        fixture.detectChanges();
        expect(fixture.componentInstance.dateValue()).toBe("2026-10-31");
        expect(fixture.componentInstance.timeValue()).toBe("09:05");
        expect(date.value).toBe("2026-10-31");
        expect(time.value).toBe("09:05");
    });

    test("required and disabled reach both inputs; disabled reaches the button", () => {
        const { date, time, now } = parts(render({ required: true, disabled: true }));
        expect(date.required && time.required).toBe(true);
        expect(date.disabled && time.disabled && now.disabled).toBe(true);
    });

    @Component({
        standalone: true,
        imports: [DateTimeNowInput],
        template: `<form><lily-date-time-now-input label="When" dateLabel="Fecha" timeLabel="Hora" nowLabel="Ahora" [(dateValue)]="date" [(timeValue)]="time" /></form>`,
    })
    class FormHost {
        date = signal("2026-01-01");
        time = signal("10:00");
    }

    test("a form reset restores both inputs and both models", async () => {
        const fixture = TestBed.createComponent(FormHost);
        fixture.detectChanges();
        await fixture.whenStable();
        const form = fixture.nativeElement.querySelector("form");
        const date = form.querySelector('input[type="date"]');
        const time = form.querySelector('input[type="time"]');
        date.value = "2026-12-25";
        date.dispatchEvent(new Event("input"));
        time.value = "23:59";
        time.dispatchEvent(new Event("input"));
        form.reset();
        await new Promise((r) => setTimeout(r, 0));
        expect(fixture.componentInstance.date()).toBe("2026-01-01");
        expect(fixture.componentInstance.time()).toBe("10:00");
        expect(date.value).toBe("2026-01-01");
        expect(time.value).toBe("10:00");
    });
});

// @vitest-environment jsdom
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, test } from "vitest";

import { initDateTimePicker } from "./date-time-picker.client.js";

const env = nunjucks.configure(path.dirname(fileURLToPath(import.meta.url)), { autoescape: true });

const LABELS = {
    previousYear: "PrevYear",
    previousMonth: "PrevMonth",
    previousWeek: "PrevWeek",
    previousDay: "PrevDay",
    nextDay: "NextDay",
    nextWeek: "NextWeek",
    nextMonth: "NextMonth",
    nextYear: "NextYear",
    confirm: "Commit",
    cancel: "Dismiss",
};

afterEach(() => {
    document.body.innerHTML = "";
});

async function openOn(calendar: string, value: string): Promise<void> {
    const opts = { label: "Date", name: "d", labels: LABELS, locale: "en", calendar, value };
    document.body.innerHTML = env.renderString(
        `{% from "./date-time-picker.njk" import dateTimePicker %}{{ dateTimePicker(opts) }}`,
        { opts },
    );
    const root = document.body.querySelector<HTMLElement>("[data-lily-date-time-picker-root]")!;
    initDateTimePicker(root);
    root.querySelector<HTMLElement>(".date-time-picker-button")!.click();
    await new Promise((resolve) => setTimeout(resolve, 0));
}

const cell = (date: string) => document.querySelector<HTMLElement>(`[data-date="${date}"]`)!;
const period = () => document.querySelector(".date-time-picker-period")?.textContent ?? "";

describe("calendar systems", () => {
    test("Persian: 1 Farvardin starts the month", async () => {
        await openOn("persian", "2025-03-21");
        expect(cell("2025-03-21").textContent?.trim()).toBe("1");
        expect(cell("2025-03-21").hasAttribute("data-outside")).toBe(false);
        expect(cell("2025-03-20").hasAttribute("data-outside")).toBe(true);
        expect(period()).toContain("Farvardin");
    });

    test("Islamic: 1 Ramadan 1447 starts the month", async () => {
        await openOn("islamic-umalqura", "2026-02-18");
        expect(cell("2026-02-18").textContent?.trim()).toBe("1");
        expect(cell("2026-02-18").hasAttribute("data-outside")).toBe(false);
        expect(period()).toContain("Ramadan");
    });

    test("Buddhist: Gregorian months with the Buddhist year", async () => {
        await openOn("buddhist", "2026-02-14");
        expect(cell("2026-02-14").textContent?.trim()).toBe("14");
        expect(period()).toContain("2569");
    });

    test("the hidden value stays ISO Gregorian", async () => {
        await openOn("persian", "2025-03-21");
        expect(document.querySelector<HTMLInputElement>('input[type="hidden"]')!.value).toBe(
            "2025-03-21",
        );
    });
});

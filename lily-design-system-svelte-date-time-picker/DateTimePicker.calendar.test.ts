import { cleanup, render, fireEvent } from "@testing-library/svelte";
import { afterEach, describe, expect, test } from "vitest";

import DateTimePicker from "./DateTimePicker.svelte";

const labels = {
    open: "Choose date",
    dialog: "Date",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    previousYear: "Previous year",
    nextYear: "Next year",
    grid: "Days",
    apply: "Apply",
    cancel: "Cancel",
};

afterEach(cleanup);

async function openOn(calendar: string, value: string): Promise<HTMLElement> {
    const { container } = render(DateTimePicker, {
        props: { label: "Date", name: "d", value, locale: "en", calendar, labels } as never,
    });
    await fireEvent.click(container.querySelector(".date-time-picker-button")!);
    return container;
}
const cell = (root: HTMLElement, date: string) =>
    root.querySelector<HTMLElement>(`[data-date="${date}"]`)!;

describe("DateTimePicker — calendar systems", () => {
    test("Persian: 1 Farvardin starts the month", async () => {
        const root = await openOn("persian", "2025-03-21");
        expect(cell(root, "2025-03-21").textContent?.trim()).toBe("1");
        expect(cell(root, "2025-03-21").hasAttribute("data-outside")).toBe(false);
        expect(cell(root, "2025-03-20").hasAttribute("data-outside")).toBe(true);
        expect(root.textContent).toContain("Farvardin");
    });

    test("Islamic: 1 Ramadan 1447 starts the month", async () => {
        const root = await openOn("islamic-umalqura", "2026-02-18");
        expect(cell(root, "2026-02-18").textContent?.trim()).toBe("1");
        expect(cell(root, "2026-02-18").hasAttribute("data-outside")).toBe(false);
        expect(root.textContent).toContain("Ramadan");
    });

    test("Buddhist: Gregorian months with the Buddhist year", async () => {
        const root = await openOn("buddhist", "2026-02-14");
        expect(cell(root, "2026-02-14").textContent?.trim()).toBe("14");
        expect(root.textContent).toContain("2569");
    });

    test("the value stays ISO Gregorian", async () => {
        const { container } = render(DateTimePicker, {
            props: {
                label: "Date",
                name: "d",
                value: "2025-03-21",
                locale: "en",
                calendar: "persian",
                confirmOnSelect: true,
                labels,
            } as never,
        });
        await fireEvent.click(container.querySelector(".date-time-picker-button")!);
        await fireEvent.click(cell(container as HTMLElement, "2025-03-22"));
        expect(container.querySelector<HTMLInputElement>('input[name="d"]')!.value).toBe(
            "2025-03-22",
        );
    });
});

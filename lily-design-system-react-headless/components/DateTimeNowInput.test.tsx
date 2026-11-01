import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import Subject from "./DateTimeNowInput";

const labels = { dateLabel: "Fecha", timeLabel: "Hora", nowLabel: "Ahora" };

describe("DateTimeNowInput", () => {
    afterEach(() => vi.useRealTimers());

    test("renders root element with canonical class", () => {
        const { container } = render(
            <Subject
                label="Demo"
                {...labels}
            />,
        );
        const el = container.querySelector(".date-time-now-input");
        expect(el).toBeTruthy();
        expect(el?.tagName.toLowerCase()).toBe("div");
    });

    test("appends className prop to root", () => {
        const { container } = render(
            <Subject
                label="Demo"
                className="extra"
                {...labels}
            />,
        );
        const el = container.querySelector(".date-time-now-input");
        expect(el?.className).toContain("date-time-now-input");
        expect(el?.className).toContain("extra");
    });

    test("names the date input, time input and Now button from its props", () => {
        const { container } = render(
            <Subject
                label="Cita"
                {...labels}
            />,
        );
        expect(container.querySelector('input[type="date"]')!.getAttribute("aria-label")).toBe(
            "Fecha",
        );
        expect(container.querySelector('input[type="time"]')!.getAttribute("aria-label")).toBe(
            "Hora",
        );
        expect(screen.getByRole("button", { name: "Ahora" }).textContent!.trim()).toBe("Ahora");
    });

    test("has no English default: without labels the controls carry no name or text", () => {
        const { container } = render(
            <Subject {...({ label: "Cita" } as unknown as Parameters<typeof Subject>[0])} />,
        );
        for (const el of container.querySelectorAll("input, button"))
            expect(el.hasAttribute("aria-label")).toBe(false);
        expect(container.querySelector("button")!.textContent!.trim()).toBe("");
        expect(container.textContent).not.toMatch(/Date|Time|Now/);
    });

    test("Now reports the current local date and time", () => {
        vi.useFakeTimers({ toFake: ["Date"] });
        vi.setSystemTime(new Date(2026, 9, 31, 9, 5));
        const onDateChange = vi.fn();
        const onTimeChange = vi.fn();
        render(
            <Subject
                label="Cita"
                {...labels}
                onDateChange={onDateChange}
                onTimeChange={onTimeChange}
            />,
        );
        fireEvent.click(screen.getByRole("button", { name: "Ahora" }));
        expect(onDateChange).toHaveBeenCalledWith("2026-10-31");
        expect(onTimeChange).toHaveBeenCalledWith("09:05");
    });
});

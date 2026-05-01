import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./DatetimeView.vue";


describe("DatetimeView", () => {
    test("renders as a <time> element", () => {
        const { container } = render(Subject, { props: { value: "2026-04-27T10:00:00Z" } });

        const el = container.querySelector("time");
        expect(el).toBeTruthy();
    });

    test("has date-time-view class on root", () => {
        const { container } = render(Subject, { props: { value: "2026-04-27T10:00:00Z" } });

        const el = container.querySelector("time");
        expect(el?.classList.contains("date-time-view")).toBe(true);
    });

    test("sets the datetime attribute from value prop", () => {
        const { container } = render(Subject, { props: { value: "2026-04-27T10:00:00Z" } });

        const el = container.querySelector("time");
        expect(el?.getAttribute("datetime")).toBe("2026-04-27T10:00:00Z");
    });

    test("renders format text when provided", () => {
        render(Subject, { props: { value: "2026-04-27T10:00:00Z", format: "Apr 27, 2026" } });

        expect(screen.getByText("Apr 27, 2026")).toBeTruthy();
    });

    test("falls back to value when no format or slot provided", () => {
        render(Subject, { props: { value: "2026-04-27T10:00:00Z" } });

        expect(screen.getByText("2026-04-27T10:00:00Z")).toBeTruthy();
    });

    test("default slot overrides format", () => {
        render(Subject, {
            props: { value: "2026-04-27T10:00:00Z", format: "Apr 27" },
            slots: { default: "Today" },
        });

        expect(screen.getByText("Today")).toBeTruthy();
    });

    test("applies aria-label when provided", () => {
        const { container } = render(Subject, {
            props: { value: "2026-04-27T10:00:00Z", label: "Publish date" },
        });

        const el = container.querySelector("time");
        expect(el?.getAttribute("aria-label")).toBe("Publish date");
    });

    test("passes through additional HTML attributes", () => {
        const { container } = render(Subject, {
            props: { value: "2026-04-27T10:00:00Z", id: "ts" },
        });

        const el = container.querySelector("time");
        expect(el?.getAttribute("id")).toBe("ts");
    });
});

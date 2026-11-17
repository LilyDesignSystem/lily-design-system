import { render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./DeviceRecordList";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("DeviceRecordList", () => {
    test("renders a ul named by its status, with its items", () => {
        render(() => (
            <Subject
                status="known"
                statusLabel="Medical devices"
            >
                <li class="device-record-list-item">One record</li>
            </Subject>
        ));
        const list = screen.getByRole("list", { name: "Medical devices" });
        expect(list.className).toContain("device-record-list");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".device-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No known medical devices (none-known)"],
        ["not-recorded", "No known medical devices (not-recorded)"],
        ["unavailable", "No known medical devices (unavailable)"],
        ["omitted", "No known medical devices (omitted)"],
    ] as const)("status %s is the list's one item, never blank", (status, words) => {
        render(() => (
            <Subject
                status={status}
                statusLabel={words}
            />
        ));
        const items = screen.getByRole("list", { name: words }).querySelectorAll("li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("device-record-list-status");
        expect(items[0].textContent).toBe(words);
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        const props = { statusLabel: "Medical devices" } as unknown as Parameters<
            typeof Subject
        >[0];
        render(() => <Subject {...props} />);
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("DeviceRecordList has no status"),
            ),
        ).toBe(true);
    });
});

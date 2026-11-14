import { render } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./DeviceRecordListItem";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("DeviceRecordListItem", () => {
    test("renders an li with each part, each status as text and data", () => {
        const { container } = render(
            <Subject
                device="Cardiac pacemaker"
                status="active"
                statusLabel="In use"
                timing="2021-02-08"
                timingLabel="Since 8 Feb 2021"
            />,
        );
        const root = container.querySelector(".device-record-list-item") as HTMLElement;
        expect(root.tagName).toBe("LI");
        expect(root.getAttribute("data-status")).toBe("active");
        expect(root.querySelector(".device-record-list-item-device")?.textContent).toBe(
            "Cardiac pacemaker",
        );
        expect(root.querySelector(".device-record-list-item-status")?.textContent).toBe("In use");
        expect(
            root.querySelector("time.device-record-list-item-timing")?.getAttribute("datetime"),
        ).toBe("2021-02-08");
        expect(root.querySelector("time.device-record-list-item-timing")?.textContent).toBe(
            "Since 8 Feb 2021",
        );
    });

    test("renders only the parts that are given", () => {
        const { container } = render(<Subject device="Cardiac pacemaker" />);
        const root = container.querySelector(".device-record-list-item") as HTMLElement;
        expect(root.querySelector(".device-record-list-item-status")).toBeNull();
        expect(root.querySelector(".device-record-list-item-timing")).toBeNull();
        expect(root.hasAttribute("data-status")).toBe(false);
    });

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(
            <Subject
                device="Cardiac pacemaker"
                status="active"
            />,
        );
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("DeviceRecordListItem has no statusLabel"),
            ),
        ).toBe(true);
    });
});

import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./ProblemRecordList";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("ProblemRecordList", () => {
    test("renders a ul named by its status, with its items", () => {
        render(
            <Subject
                status="known"
                statusLabel="Problems"
            >
                <li className="problem-record-list-item">One record</li>
            </Subject>,
        );
        const list = screen.getByRole("list", { name: "Problems" });
        expect(list.className).toContain("problem-record-list");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".problem-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No known problems (none-known)"],
        ["not-recorded", "No known problems (not-recorded)"],
        ["unavailable", "No known problems (unavailable)"],
        ["omitted", "No known problems (omitted)"],
    ] as const)("status %s is the list's one item, never blank", (status, words) => {
        render(
            <Subject
                status={status}
                statusLabel={words}
            />,
        );
        const items = screen.getByRole("list", { name: words }).querySelectorAll("li");
        expect(items).toHaveLength(1);
        expect(items[0].className).toBe("problem-record-list-status");
        expect(items[0].textContent).toBe(words);
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        const props = { statusLabel: "Problems" } as unknown as Parameters<typeof Subject>[0];
        render(<Subject {...props} />);
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("ProblemRecordList has no status"),
            ),
        ).toBe(true);
    });
});

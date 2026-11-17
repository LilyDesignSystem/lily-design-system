import { render } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./ProcedureRecordListItem";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("ProcedureRecordListItem", () => {
    test("renders an li with each part, each status as text and data", () => {
        const { container } = render(() => (
            <Subject
                procedure="Appendectomy"
                status="completed"
                statusLabel="Completed"
                performed="2018-04-22"
                performedLabel="22 Apr 2018"
            />
        ));
        const root = container.querySelector(".procedure-record-list-item") as HTMLElement;
        expect(root.tagName).toBe("LI");
        expect(root.getAttribute("data-status")).toBe("completed");
        expect(root.querySelector(".procedure-record-list-item-procedure")?.textContent).toBe(
            "Appendectomy",
        );
        expect(root.querySelector(".procedure-record-list-item-status")?.textContent).toBe(
            "Completed",
        );
        expect(
            root
                .querySelector("time.procedure-record-list-item-performed")
                ?.getAttribute("datetime"),
        ).toBe("2018-04-22");
        expect(root.querySelector("time.procedure-record-list-item-performed")?.textContent).toBe(
            "22 Apr 2018",
        );
    });

    test("renders only the parts that are given", () => {
        const { container } = render(() => <Subject procedure="Appendectomy" />);
        const root = container.querySelector(".procedure-record-list-item") as HTMLElement;
        expect(root.querySelector(".procedure-record-list-item-status")).toBeNull();
        expect(root.querySelector(".procedure-record-list-item-performed")).toBeNull();
        expect(root.hasAttribute("data-status")).toBe(false);
    });

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(() => (
            <Subject
                procedure="Appendectomy"
                status="completed"
            />
        ));
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("ProcedureRecordListItem has no statusLabel"),
            ),
        ).toBe(true);
    });
});

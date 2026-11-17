import { render } from "@solidjs/testing-library";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./ProblemRecordListItem";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("ProblemRecordListItem", () => {
    test("renders an li with each part, each status as text and data", () => {
        const { container } = render(() => (
            <Subject
                condition="Type 2 diabetes"
                clinicalStatus="active"
                clinicalStatusLabel="Active"
                verificationStatus="confirmed"
                verificationStatusLabel="Confirmed"
                severityLabel="Moderate"
                onset="2019-06-01"
                onsetLabel="Since June 2019"
                abatement="2024-01-15"
                abatementLabel="Resolved 15 Jan 2024"
            />
        ));
        const root = container.querySelector(".problem-record-list-item") as HTMLElement;
        expect(root.tagName).toBe("LI");
        expect(root.getAttribute("data-clinical-status")).toBe("active");
        expect(root.getAttribute("data-verification-status")).toBe("confirmed");
        expect(root.querySelector(".problem-record-list-item-condition")?.textContent).toBe(
            "Type 2 diabetes",
        );
        expect(root.querySelector(".problem-record-list-item-clinical-status")?.textContent).toBe(
            "Active",
        );
        expect(
            root.querySelector(".problem-record-list-item-verification-status")?.textContent,
        ).toBe("Confirmed");
        expect(root.querySelector(".problem-record-list-item-severity")?.textContent).toBe(
            "Moderate",
        );
        expect(
            root.querySelector("time.problem-record-list-item-onset")?.getAttribute("datetime"),
        ).toBe("2019-06-01");
        expect(root.querySelector("time.problem-record-list-item-onset")?.textContent).toBe(
            "Since June 2019",
        );
        expect(
            root.querySelector("time.problem-record-list-item-abatement")?.getAttribute("datetime"),
        ).toBe("2024-01-15");
        expect(root.querySelector("time.problem-record-list-item-abatement")?.textContent).toBe(
            "Resolved 15 Jan 2024",
        );
    });

    test("renders only the parts that are given", () => {
        const { container } = render(() => <Subject condition="Type 2 diabetes" />);
        const root = container.querySelector(".problem-record-list-item") as HTMLElement;
        expect(root.querySelector(".problem-record-list-item-clinical-status")).toBeNull();
        expect(root.querySelector(".problem-record-list-item-verification-status")).toBeNull();
        expect(root.querySelector(".problem-record-list-item-severity")).toBeNull();
        expect(root.querySelector(".problem-record-list-item-onset")).toBeNull();
        expect(root.querySelector(".problem-record-list-item-abatement")).toBeNull();
        expect(root.hasAttribute("data-clinical-status")).toBe(false);
        expect(root.hasAttribute("data-verification-status")).toBe(false);
    });

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(() => (
            <Subject
                condition="Type 2 diabetes"
                clinicalStatus="active"
            />
        ));
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("ProblemRecordListItem has no clinicalStatusLabel"),
            ),
        ).toBe(true);
    });

    test("says whose record it is first, when it is not the patient's", () => {
        const { container } = render(() => (
            <Subject
                condition="Breast cancer"
                subjectLabel="Mother"
            />
        ));
        const root = container.querySelector(".problem-record-list-item") as HTMLElement;
        expect(root.firstElementChild?.className).toBe("problem-record-list-item-subject");
        expect(root.textContent).toMatch(/^Mother\s+Breast cancer/);
    });
});

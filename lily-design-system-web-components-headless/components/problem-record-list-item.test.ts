import { afterEach, describe, expect, test } from "vitest";

import { ProblemRecordListItem } from "./problem-record-list-item.js";

if (!customElements.get("lily-problem-record-list-item"))
    customElements.define("lily-problem-record-list-item", ProblemRecordListItem);

afterEach(() => {
    document.body.innerHTML = "";
});

describe("ProblemRecordListItem", () => {
    test("replaces itself with an li holding each part, each status as text and data", () => {
        document.body.innerHTML = `<ul><lily-problem-record-list-item condition="Type 2 diabetes" clinical-status="active" clinical-status-label="Active" verification-status="confirmed" verification-status-label="Confirmed" severity-label="Moderate" onset="2019-06-01" onset-label="Since June 2019" abatement="2024-01-15" abatement-label="Resolved 15 Jan 2024"></lily-problem-record-list-item></ul>`;
        expect(document.querySelector("lily-problem-record-list-item")).toBeNull();
        const li = document.querySelector("ul > li.problem-record-list-item") as HTMLElement;
        expect(li.getAttribute("data-clinical-status")).toBe("active");
        expect(li.getAttribute("data-verification-status")).toBe("confirmed");
        expect(li.querySelector(".problem-record-list-item-condition")?.textContent).toBe(
            "Type 2 diabetes",
        );
        expect(li.querySelector(".problem-record-list-item-clinical-status")?.textContent).toBe(
            "Active",
        );
        expect(li.querySelector(".problem-record-list-item-verification-status")?.textContent).toBe(
            "Confirmed",
        );
        expect(li.querySelector(".problem-record-list-item-severity")?.textContent).toBe(
            "Moderate",
        );
        expect(
            li.querySelector("time.problem-record-list-item-onset")?.getAttribute("datetime"),
        ).toBe("2019-06-01");
        expect(li.querySelector("time.problem-record-list-item-onset")?.textContent).toBe(
            "Since June 2019",
        );
        expect(
            li.querySelector("time.problem-record-list-item-abatement")?.getAttribute("datetime"),
        ).toBe("2024-01-15");
        expect(li.querySelector("time.problem-record-list-item-abatement")?.textContent).toBe(
            "Resolved 15 Jan 2024",
        );
    });

    test("renders only the parts that are given", () => {
        document.body.innerHTML = `<ul><lily-problem-record-list-item condition="Type 2 diabetes"></lily-problem-record-list-item></ul>`;
        const li = document.querySelector("ul > li.problem-record-list-item") as HTMLElement;
        expect(li.querySelector(".problem-record-list-item-clinical-status")).toBeNull();
        expect(li.querySelector(".problem-record-list-item-verification-status")).toBeNull();
        expect(li.querySelector(".problem-record-list-item-severity")).toBeNull();
        expect(li.querySelector(".problem-record-list-item-onset")).toBeNull();
        expect(li.querySelector(".problem-record-list-item-abatement")).toBeNull();
        expect(li.hasAttribute("data-clinical-status")).toBe(false);
        expect(li.hasAttribute("data-verification-status")).toBe(false);
    });
});

import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./TableRow";

function renderIn(props: Record<string, unknown> = {}, body: React.ReactNode = <><td>cell</td></>) {
    return render(
        <table><tbody><Subject {...props}>{body}</Subject></tbody></table>
    );
}

describe("TableRow", () => {
    test("renders a tr element", () => {
        renderIn();
        const el = document.querySelector("tr");
        expect(el).toBeTruthy();
    });

    test("applies class table-row", () => {
        renderIn();
        const el = document.querySelector("tr");
        expect(el?.getAttribute("class")).toContain("table-row");
    });

    test("passes through attributes", () => {
        renderIn({ "data-testid": "subject" });
        const el = document.querySelector("tr");
        expect(el?.getAttribute("data-testid")).toBe("subject");
    });
});

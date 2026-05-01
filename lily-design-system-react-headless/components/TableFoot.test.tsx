import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./TableFoot";

function renderIn(props: Record<string, unknown> = {}, body: React.ReactNode = <><tr><td>cell</td></tr></>) {
    return render(
        <table><Subject {...props}>{body}</Subject></table>
    );
}

describe("TableFoot", () => {
    test("renders a tfoot element", () => {
        renderIn();
        const el = document.querySelector("tfoot");
        expect(el).toBeTruthy();
    });

    test("applies class table-foot", () => {
        renderIn();
        const el = document.querySelector("tfoot");
        expect(el?.getAttribute("class")).toContain("table-foot");
    });

    test("passes through attributes", () => {
        renderIn({ "data-testid": "subject" });
        const el = document.querySelector("tfoot");
        expect(el?.getAttribute("data-testid")).toBe("subject");
    });
});

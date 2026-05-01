import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./TableHead";

function renderInTable(props: Record<string, unknown> = {}, body: React.ReactNode = <tr><th>Name</th></tr>) {
    return render(
        <table>
            <Subject {...props}>{body}</Subject>
        </table>
    );
}

describe("TableHead", () => {
    test("renders a thead element", () => {
        renderInTable();
        const thead = document.querySelector("thead");
        expect(thead).toBeTruthy();
    });

    test("applies class table-head", () => {
        renderInTable();
        const thead = document.querySelector("thead");
        expect(thead?.getAttribute("class")).toContain("table-head");
    });

    test("renders children content", () => {
        renderInTable({}, <tr><th>Email</th></tr>);
        const th = document.querySelector("thead th");
        expect(th?.textContent).toBe("Email");
    });

    test("passes through attributes", () => {
        renderInTable({ "data-testid": "head" });
        const thead = document.querySelector("thead");
        expect(thead?.getAttribute("data-testid")).toBe("head");
    });
});

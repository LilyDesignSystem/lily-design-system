import type { JSX } from "@solidjs/web";
import { describe, expect, test } from "vitest";
import { render } from "@solidjs/testing-library";

import Subject from "./TableBody";

function renderIn(
    props: Record<string, unknown> = {},
    body: JSX.Element = (
        <>
            <tr>
                <td>cell</td>
            </tr>
        </>
    ),
) {
    return render(() => (
        <table>
            <Subject {...props}>{body}</Subject>
        </table>
    ));
}

describe("TableBody", () => {
    test("renders a tbody element", () => {
        renderIn();
        const el = document.querySelector("tbody");
        expect(el).toBeTruthy();
    });

    test("applies class table-body", () => {
        renderIn();
        const el = document.querySelector("tbody");
        expect(el?.getAttribute("class")).toContain("table-body");
    });

    test("passes through attributes", () => {
        renderIn({ "data-testid": "subject" });
        const el = document.querySelector("tbody");
        expect(el?.getAttribute("data-testid")).toBe("subject");
    });
});

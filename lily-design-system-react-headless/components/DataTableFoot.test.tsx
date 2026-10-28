import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./DataTableFoot";

describe("DataTableFoot", () => {
    test("renders a tfoot element", () => {
        render(
            <table>
                <Subject>
                    <tr>
                        <td>Total</td>
                    </tr>
                </Subject>
            </table>,
        );
        const tfoot = document.querySelector("tfoot");
        expect(tfoot).toBeTruthy();
    });

    test("renders children content", () => {
        render(
            <table>
                <Subject>
                    <tr>
                        <td>$50,000</td>
                    </tr>
                </Subject>
            </table>,
        );
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("$50,000");
    });

    test("passes through attributes", () => {
        render(
            <table>
                <Subject data-testid="foot">
                    <tr>
                        <td>x</td>
                    </tr>
                </Subject>
            </table>,
        );
        const tfoot = document.querySelector("tfoot");
        expect(tfoot?.getAttribute("data-testid")).toBe("foot");
    });
});

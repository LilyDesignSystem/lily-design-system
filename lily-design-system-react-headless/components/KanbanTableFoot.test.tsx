import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./KanbanTableFoot";

describe("KanbanTableFoot", () => {
    test("renders a tfoot element", () => {
        render(
            <table>
                <Subject>
                    <tr>
                        <td>Total: 3</td>
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
                        <td>Total: 5</td>
                    </tr>
                </Subject>
            </table>,
        );
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("Total: 5");
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

import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./KanbanTableHead";

describe("KanbanTableHead", () => {
    test("renders a thead element", () => {
        render(
            <table>
                <Subject>
                    <tr>
                        <th>To Do</th>
                    </tr>
                </Subject>
            </table>,
        );
        const thead = document.querySelector("thead");
        expect(thead).toBeTruthy();
    });

    test("renders children content", () => {
        render(
            <table>
                <Subject>
                    <tr>
                        <th>In Progress</th>
                    </tr>
                </Subject>
            </table>,
        );
        const th = document.querySelector("th");
        expect(th?.textContent).toBe("In Progress");
    });

    test("passes through attributes", () => {
        render(
            <table>
                <Subject data-testid="head">
                    <tr>
                        <th>x</th>
                    </tr>
                </Subject>
            </table>,
        );
        const thead = document.querySelector("thead");
        expect(thead?.getAttribute("data-testid")).toBe("head");
    });
});

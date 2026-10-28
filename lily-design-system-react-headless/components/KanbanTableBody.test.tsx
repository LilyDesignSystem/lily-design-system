import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./KanbanTableBody";

describe("KanbanTableBody", () => {
    test("renders a tbody element", () => {
        render(
            <table>
                <Subject>
                    <tr>
                        <td>Task A</td>
                    </tr>
                </Subject>
            </table>,
        );
        const tbody = document.querySelector("tbody");
        expect(tbody).toBeTruthy();
    });

    test("renders children content", () => {
        render(
            <table>
                <Subject>
                    <tr>
                        <td>Task B</td>
                    </tr>
                </Subject>
            </table>,
        );
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("Task B");
    });

    test("passes through attributes", () => {
        render(
            <table>
                <Subject data-testid="body">
                    <tr>
                        <td>x</td>
                    </tr>
                </Subject>
            </table>,
        );
        const tbody = document.querySelector("tbody");
        expect(tbody?.getAttribute("data-testid")).toBe("body");
    });
});

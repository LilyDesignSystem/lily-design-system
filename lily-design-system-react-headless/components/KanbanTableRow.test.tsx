import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./KanbanTableRow";

describe("KanbanTableRow", () => {
    test("renders a tr element", () => {
        render(
            <table>
                <tbody>
                    <Subject>
                        <td>Task</td>
                    </Subject>
                </tbody>
            </table>,
        );
        const row = document.querySelector("tr");
        expect(row).toBeTruthy();
    });

    test("has implicit row role without explicit role attribute", () => {
        render(
            <table>
                <tbody>
                    <Subject>
                        <td>Task</td>
                    </Subject>
                </tbody>
            </table>,
        );
        const row = document.querySelector("tr");
        expect(row?.getAttribute("role")).toBeNull();
    });

    test("renders children content", () => {
        render(
            <table>
                <tbody>
                    <Subject>
                        <td>Design review</td>
                    </Subject>
                </tbody>
            </table>,
        );
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("Design review");
    });

    test("renders multiple cells", () => {
        render(
            <table>
                <tbody>
                    <Subject>
                        <td>To Do</td>
                        <td>In Progress</td>
                        <td>Done</td>
                    </Subject>
                </tbody>
            </table>,
        );
        expect(document.querySelectorAll("td").length).toBe(3);
    });

    test("passes through attributes", () => {
        render(
            <table>
                <tbody>
                    <Subject data-row="1">
                        <td>x</td>
                    </Subject>
                </tbody>
            </table>,
        );
        const row = document.querySelector("tr");
        expect(row?.getAttribute("data-row")).toBe("1");
    });
});

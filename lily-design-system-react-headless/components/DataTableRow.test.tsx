import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./DataTableRow";

describe("DataTableRow", () => {
    test("renders a tr element", () => {
        render(
            <table>
                <tbody>
                    <Subject>
                        <td>Alice</td>
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
                        <td>Alice</td>
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
                        <td>Bob</td>
                    </Subject>
                </tbody>
            </table>,
        );
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("Bob");
    });

    test("renders multiple cells", () => {
        render(
            <table>
                <tbody>
                    <Subject>
                        <td>Alice</td>
                        <td>alice@example.com</td>
                    </Subject>
                </tbody>
            </table>,
        );
        const cells = document.querySelectorAll("td");
        expect(cells.length).toBe(2);
        expect(cells[0].textContent).toBe("Alice");
        expect(cells[1].textContent).toBe("alice@example.com");
    });

    test("passes through attributes", () => {
        render(
            <table>
                <tbody>
                    <Subject data-testid="row">
                        <td>x</td>
                    </Subject>
                </tbody>
            </table>,
        );
        const row = document.querySelector("tr");
        expect(row?.getAttribute("data-testid")).toBe("row");
    });
});

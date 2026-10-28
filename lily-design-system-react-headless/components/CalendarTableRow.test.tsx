import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./CalendarTableRow";

describe("CalendarTableRow", () => {
    test("renders a tr element", () => {
        render(
            <table>
                <tbody>
                    <Subject>
                        <td>1</td>
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
                        <td>1</td>
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
                        <td>15</td>
                    </Subject>
                </tbody>
            </table>,
        );
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("15");
    });

    test("renders multiple children cells", () => {
        render(
            <table>
                <tbody>
                    <Subject>
                        <td>1</td>
                        <td>2</td>
                        <td>3</td>
                        <td>4</td>
                        <td>5</td>
                        <td>6</td>
                        <td>7</td>
                    </Subject>
                </tbody>
            </table>,
        );
        const cells = document.querySelectorAll("td");
        expect(cells.length).toBe(7);
        expect(cells[0].textContent).toBe("1");
        expect(cells[6].textContent).toBe("7");
    });

    test("passes through attributes", () => {
        render(
            <table>
                <tbody>
                    <Subject data-testid="row">
                        <td>1</td>
                    </Subject>
                </tbody>
            </table>,
        );
        const row = document.querySelector("tr");
        expect(row?.getAttribute("data-testid")).toBe("row");
    });
});

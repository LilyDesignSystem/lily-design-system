import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./DataTableBody";

describe("DataTableBody", () => {
    test("renders a tbody element", () => {
        render(
            <table>
                <Subject>
                    <tr>
                        <td>Alice</td>
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
                        <td>Bob</td>
                    </tr>
                </Subject>
            </table>,
        );
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("Bob");
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

import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./CalendarTableBody";

describe("CalendarTableBody", () => {
    test("renders a tbody element", () => {
        render(
            <table>
                <Subject>
                    <tr>
                        <td>1</td>
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
                        <td>15</td>
                    </tr>
                </Subject>
            </table>,
        );
        const td = document.querySelector("td");
        expect(td?.textContent).toBe("15");
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

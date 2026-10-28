import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./CalendarTableHead";

describe("CalendarTableHead", () => {
    test("renders a thead element", () => {
        render(
            <table>
                <Subject>
                    <tr>
                        <th>Sun</th>
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
                        <th>Mon</th>
                    </tr>
                </Subject>
            </table>,
        );
        const th = document.querySelector("th");
        expect(th?.textContent).toBe("Mon");
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

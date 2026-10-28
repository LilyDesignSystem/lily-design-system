import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";

import Subject from "./DataTableHead";

describe("DataTableHead", () => {
    test("renders a thead element", () => {
        render(
            <table>
                <Subject>
                    <tr>
                        <th>Name</th>
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
                        <th>Email</th>
                    </tr>
                </Subject>
            </table>,
        );
        const th = document.querySelector("th");
        expect(th?.textContent).toBe("Email");
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

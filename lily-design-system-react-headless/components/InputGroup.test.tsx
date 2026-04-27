import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./InputGroup";

describe("InputGroup", () => {
    test("renders children and applies the input-group root class", () => {
        render(
            <Subject>
                <input type="text" data-testid="input" />
            </Subject>,
        );

        const input: HTMLElement = screen.getByTestId("input");
        expect(input).toBeTruthy();
        const group: HTMLElement = screen.getByRole("group");
        expect(group.className.includes("input-group")).toBe(true);
    });

    test("uses role=group", () => {
        render(
            <Subject>
                <input type="text" />
            </Subject>,
        );

        const group: HTMLElement = screen.getByRole("group");
        expect(group.getAttribute("role")).toBe("group");
    });

    test("applies aria-label from label prop", () => {
        render(
            <Subject label="Amount">
                <input type="number" />
            </Subject>,
        );

        const group: HTMLElement = screen.getByRole("group", { name: "Amount" });
        expect(group.getAttribute("aria-label")).toBe("Amount");
    });

    test("renders prefix wrapped in input-group-prefix", () => {
        render(
            <Subject prefix={<span data-testid="dollar">$</span>}>
                <input type="number" />
            </Subject>,
        );

        const dollar: HTMLElement = screen.getByTestId("dollar");
        expect(dollar.parentElement?.className).toBe("input-group-prefix");
    });

    test("renders suffix wrapped in input-group-suffix", () => {
        render(
            <Subject suffix={<span data-testid="usd">USD</span>}>
                <input type="number" />
            </Subject>,
        );

        const usd: HTMLElement = screen.getByTestId("usd");
        expect(usd.parentElement?.className).toBe("input-group-suffix");
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject id="amount-group">
                <input type="text" />
            </Subject>,
        );

        const group: HTMLElement = screen.getByRole("group");
        expect(group.getAttribute("id")).toBe("amount-group");
    });
});

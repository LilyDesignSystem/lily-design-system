import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ValidationListItem";

describe("ValidationListItem", () => {
    test("renders as a list item", () => {
        render(
            <ul>
                <Subject>Rule text</Subject>
            </ul>
        );

        const item: HTMLElement = screen.getByRole("listitem");
        expect(item).toBeTruthy();
    });

    test("applies the validation-list-item root class", () => {
        render(
            <ul>
                <Subject>Rule text</Subject>
            </ul>
        );

        const item: HTMLElement = screen.getByRole("listitem");
        expect(item.className.includes("validation-list-item")).toBe(true);
    });

    test("defaults status to pending via data-status", () => {
        render(
            <ul>
                <Subject>Rule text</Subject>
            </ul>
        );

        const item: HTMLElement = screen.getByRole("listitem");
        expect(item.getAttribute("data-status")).toBe("pending");
    });

    test("reflects the status prop in data-status (passed)", () => {
        render(
            <ul>
                <Subject status="passed">Rule text</Subject>
            </ul>
        );

        const item: HTMLElement = screen.getByRole("listitem");
        expect(item.getAttribute("data-status")).toBe("passed");
    });

    test("reflects the status prop in data-status (failed)", () => {
        render(
            <ul>
                <Subject status="failed">Rule text</Subject>
            </ul>
        );

        const item: HTMLElement = screen.getByRole("listitem");
        expect(item.getAttribute("data-status")).toBe("failed");
    });

    test("renders the rule text", () => {
        render(
            <ul>
                <Subject>At least 8 characters</Subject>
            </ul>
        );

        const item: HTMLElement = screen.getByRole("listitem");
        expect(item.textContent).toContain("At least 8 characters");
    });

    test("sets aria-label when label is provided", () => {
        render(
            <ul>
                <Subject label="Length rule passed">
                    At least 8 characters
                </Subject>
            </ul>
        );

        const item: HTMLElement = screen.getByRole("listitem");
        expect(item.getAttribute("aria-label")).toBe("Length rule passed");
    });

    test("passes through additional HTML attributes", () => {
        render(
            <ul>
                <Subject id="rule-1">Rule</Subject>
            </ul>
        );

        const item: HTMLElement = screen.getByRole("listitem");
        expect(item.getAttribute("id")).toBe("rule-1");
    });
});

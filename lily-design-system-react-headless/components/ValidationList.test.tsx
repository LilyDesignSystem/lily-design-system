import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./ValidationList";

describe("ValidationList", () => {
    test("renders as a list with aria-label and aria-live", () => {
        render(
            <Subject label="Password requirements">
                <li>Rule</li>
            </Subject>
        );

        const list: HTMLElement = screen.getByRole("list", {
            name: "Password requirements",
        });
        expect(list.getAttribute("aria-label")).toBe("Password requirements");
        expect(list.getAttribute("aria-live")).toBe("polite");
    });

    test("applies the validation-list root class", () => {
        render(
            <Subject label="Rules">
                <li>Rule</li>
            </Subject>
        );

        const list: HTMLElement = screen.getByRole("list");
        expect(list.className.includes("validation-list")).toBe(true);
    });

    test("renders children", () => {
        render(
            <Subject label="Rules">
                <li>Rule one</li>
                <li>Rule two</li>
            </Subject>
        );

        const items: HTMLElement[] = screen.getAllByRole("listitem");
        expect(items.length).toBe(2);
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject label="Rules" id="my-validation">
                <li>Rule</li>
            </Subject>
        );

        const list: HTMLElement = screen.getByRole("list");
        expect(list.getAttribute("id")).toBe("my-validation");
    });
});

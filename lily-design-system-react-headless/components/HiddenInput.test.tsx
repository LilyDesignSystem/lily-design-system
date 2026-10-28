import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./HiddenInput";

describe("HiddenInput", () => {
    test("renders a hidden input", () => {
        const { container } = render(
            <Subject
                name="token"
                value="abc"
            />,
        );
        const input = container.querySelector("input[type='hidden']") as HTMLInputElement;
        expect(input).toBeTruthy();
    });

    test("has correct name", () => {
        const { container } = render(
            <Subject
                name="csrf"
                value="xyz"
            />,
        );
        const input = container.querySelector("input") as HTMLInputElement;
        expect(input.name).toBe("csrf");
    });

    test("has correct value", () => {
        const { container } = render(
            <Subject
                name="id"
                value="123"
            />,
        );
        const input = container.querySelector("input") as HTMLInputElement;
        expect(input.value).toBe("123");
    });

    test("passes through attributes", () => {
        const { container } = render(
            <Subject
                name="x"
                data-testid="hi"
            />,
        );
        expect(container.querySelector("[data-testid='hi']")).toBeTruthy();
    });
});

import { act, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import Subject from "./TextAreaInputWithCharacterCounter";

describe("TextAreaInputWithCharacterCounter", () => {
    test("renders root element with canonical class", () => {
        const { container } = render(
            <Subject
                label="Demo"
                maxLength={100}
            />,
        );
        const el = container.querySelector(".text-area-input-with-character-counter");
        expect(el).toBeTruthy();
        expect(el?.tagName.toLowerCase()).toBe("div");
    });

    test("appends className prop to root", () => {
        const { container } = render(
            <Subject
                label="Demo"
                className="extra"
                maxLength={100}
            />,
        );
        const el = container.querySelector(".text-area-input-with-character-counter");
        expect(el?.className).toContain("text-area-input-with-character-counter");
        expect(el?.className).toContain("extra");
    });

    test("counts with the numbers alone by default: no English", () => {
        const { container } = render(
            <Subject
                label="Demo"
                maxLength={100}
            />,
        );
        expect(container.textContent).toContain("0 / 100");
        expect(container.textContent).not.toMatch(/characters|of/);
    });

    test("fills in the consumer's counterTemplate", () => {
        const { container } = render(
            <Subject
                label="Demo"
                maxLength={100}
                counterTemplate="{count} de {max} caractères"
            />,
        );
        expect(container.textContent).toContain("0 de 100 caractères");
    });

    test("the counter is not live itself: a status takes it once typing pauses", () => {
        vi.useFakeTimers();
        const { rerender, container } = render(
            <Subject
                label="Demo"
                maxLength={10}
                value=""
            />,
        );
        expect(container.querySelector("[aria-live]")).toBeNull();
        for (const value of ["a", "ab", "abc"]) {
            rerender(
                <Subject
                    label="Demo"
                    maxLength={10}
                    value={value}
                />,
            );
            act(() => vi.advanceTimersByTime(300));
        }
        expect(screen.getByRole("status").textContent).toBe("0 / 10");
        act(() => vi.advanceTimersByTime(1000));
        expect(screen.getByRole("status").textContent).toBe("3 / 10");
        const field = screen.getByLabelText("Demo");
        expect(
            document
                .getElementById(field.getAttribute("aria-describedby")!)!
                .contains(screen.getByRole("status")),
        ).toBe(true);
        vi.useRealTimers();
    });
});

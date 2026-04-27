import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./Statistic";

describe("Statistic", () => {
    test("renders a group with the statistic root class", () => {
        render(<Subject title="Revenue" value="123" />);

        const group: HTMLElement = screen.getByRole("group");
        expect(group.className.includes("statistic")).toBe(true);
    });

    test("renders the title and value", () => {
        const { container } = render(<Subject title="Revenue" value="123,456" />);

        const titleEl: HTMLElement = container.querySelector(".statistic-title") as HTMLElement;
        const valueEl: HTMLElement = container.querySelector(".statistic-value") as HTMLElement;
        expect(titleEl.textContent).toBe("Revenue");
        expect(valueEl.textContent).toContain("123,456");
    });

    test("auto aria-label combines title and value", () => {
        render(<Subject title="Revenue" value="123,456" />);
        const group: HTMLElement = screen.getByRole("group");
        expect(group.getAttribute("aria-label")).toBe("Revenue: 123,456");
    });

    test("custom aria-label overrides the auto label", () => {
        render(<Subject title="Revenue" value="123" label="Annual revenue" />);
        const group: HTMLElement = screen.getByRole("group");
        expect(group.getAttribute("aria-label")).toBe("Annual revenue");
    });

    test("renders prefix when provided", () => {
        const { container } = render(
            <Subject title="t" value="100" prefix="$" />
        );

        const prefixEl: HTMLElement | null = container.querySelector(".statistic-prefix");
        expect(prefixEl).toBeTruthy();
        expect(prefixEl?.textContent).toBe("$");
    });

    test("renders suffix when provided", () => {
        const { container } = render(
            <Subject title="t" value="98" suffix="%" />
        );

        const suffixEl: HTMLElement | null = container.querySelector(".statistic-suffix");
        expect(suffixEl).toBeTruthy();
        expect(suffixEl?.textContent).toBe("%");
    });

    test("does not render prefix span when no prefix", () => {
        const { container } = render(<Subject title="t" value="x" />);
        expect(container.querySelector(".statistic-prefix")).toBeNull();
    });

    test("does not render suffix span when no suffix", () => {
        const { container } = render(<Subject title="t" value="x" />);
        expect(container.querySelector(".statistic-suffix")).toBeNull();
    });

    test("supports ReactNode prefix and suffix", () => {
        const { container } = render(
            <Subject
                title="t"
                value="1"
                prefix={<span data-testid="pre">P</span>}
                suffix={<span data-testid="suf">S</span>}
            />
        );
        expect(container.querySelector("[data-testid='pre']")).toBeTruthy();
        expect(container.querySelector("[data-testid='suf']")).toBeTruthy();
    });

    test("passes through additional HTML attributes", () => {
        render(<Subject title="t" value="1" id="stat-1" />);
        const group: HTMLElement = screen.getByRole("group");
        expect(group.getAttribute("id")).toBe("stat-1");
    });
});

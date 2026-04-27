import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./SummaryBox";

describe("SummaryBox", () => {
    test("renders as a complementary landmark", () => {
        render(
            <Subject heading="Key takeaways">
                <p>Body</p>
            </Subject>
        );

        const aside: HTMLElement = screen.getByRole("complementary", {
            name: "Key takeaways",
        });
        expect(aside).toBeTruthy();
    });

    test("applies the summary-box root class", () => {
        render(
            <Subject heading="Key takeaways">
                <p>Body</p>
            </Subject>
        );

        const aside: HTMLElement = screen.getByRole("complementary");
        expect(aside.className.includes("summary-box")).toBe(true);
    });

    test("uses the heading text as the default aria-label", () => {
        render(
            <Subject heading="Key takeaways">
                <p>Body</p>
            </Subject>
        );

        const aside: HTMLElement = screen.getByRole("complementary");
        expect(aside.getAttribute("aria-label")).toBe("Key takeaways");
    });

    test("allows label to override the aria-label", () => {
        render(
            <Subject heading="Key takeaways" label="Custom label">
                <p>Body</p>
            </Subject>
        );

        const aside: HTMLElement = screen.getByRole("complementary");
        expect(aside.getAttribute("aria-label")).toBe("Custom label");
    });

    test("renders the heading as h3", () => {
        render(
            <Subject heading="Key takeaways">
                <p>Body</p>
            </Subject>
        );

        const h3: HTMLElement = screen.getByRole("heading", { level: 3 });
        expect(h3.textContent).toContain("Key takeaways");
    });

    test("renders body children", () => {
        render(
            <Subject heading="Key takeaways">
                <p>Plain language wins</p>
            </Subject>
        );

        const aside: HTMLElement = screen.getByRole("complementary");
        expect(aside.textContent).toContain("Plain language wins");
    });

    test("passes through additional HTML attributes", () => {
        render(
            <Subject heading="Key takeaways" id="my-summary">
                <p>Body</p>
            </Subject>
        );

        const aside: HTMLElement = screen.getByRole("complementary");
        expect(aside.getAttribute("id")).toBe("my-summary");
    });
});

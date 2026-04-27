import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./SummaryBox.vue";


describe("SummaryBox", () => {
    test("renders as a complementary landmark", () => {
        render(Subject, { props: { heading: "Key takeaways" } });

        const aside: HTMLElement = screen.getByRole("complementary");
        expect(aside).toBeTruthy();
    });

    test("has summary-box class on root", () => {
        render(Subject, { props: { heading: "Key takeaways" } });

        const aside: HTMLElement = screen.getByRole("complementary");
        expect(aside.classList.contains("summary-box")).toBe(true);
    });

    test("aria-label defaults to the heading", () => {
        render(Subject, { props: { heading: "Key takeaways" } });

        const aside: HTMLElement = screen.getByRole("complementary");
        expect(aside.getAttribute("aria-label")).toBe("Key takeaways");
    });

    test("aria-label can be overridden via label prop", () => {
        render(Subject, { props: { heading: "Key takeaways", label: "Important info" } });

        const aside: HTMLElement = screen.getByRole("complementary");
        expect(aside.getAttribute("aria-label")).toBe("Important info");
    });

    test("renders heading as h3", () => {
        const { container } = render(Subject, { props: { heading: "Key takeaways" } });

        const h3: HTMLElement | null = container.querySelector("h3");
        expect(h3).toBeTruthy();
        expect(h3?.textContent).toBe("Key takeaways");
        expect(h3?.classList.contains("summary-box-heading")).toBe(true);
    });

    test("renders default slot content in body", () => {
        render(Subject, {
            props: { heading: "Key takeaways" },
            slots: { default: "<p>Read this.</p>" },
        });

        expect(screen.getByText("Read this.")).toBeTruthy();
    });

    test("body wrapper has summary-box-body class", () => {
        const { container } = render(Subject, {
            props: { heading: "Key takeaways" },
            slots: { default: "<p>Read this.</p>" },
        });

        const body: HTMLElement | null = container.querySelector(".summary-box-body");
        expect(body).toBeTruthy();
    });
});

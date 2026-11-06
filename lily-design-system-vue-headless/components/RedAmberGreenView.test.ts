import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./RedAmberGreenView.vue";

describe("RedAmberGreenView", () => {
    test("renders a span element", () => {
        render(Subject, { props: { label: "Status" } });

        const el = document.querySelector(".red-amber-green-view") as HTMLElement;
        expect(el.tagName).toBe("SPAN");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: { label: "Status" } });

        const el = document.querySelector(".red-amber-green-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(`${"Status"} `);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    test("displays the value as text", () => {
        render(Subject, { props: { label: "Status", value: "green" } });

        const el = document.querySelector(".red-amber-green-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("green");
    });

    test("displays red status", () => {
        render(Subject, { props: { label: "Status", value: "red" } });

        const el = document.querySelector(".red-amber-green-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("red");
    });

    test("displays amber status", () => {
        render(Subject, { props: { label: "Status", value: "amber" } });

        const el = document.querySelector(".red-amber-green-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("amber");
    });

    test("defaults to empty string when no value provided", () => {
        render(Subject, { props: { label: "Status" } });

        const el = document.querySelector(".red-amber-green-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "S", "data-testid": "rag-view" } });

        expect(screen.getByTestId("rag-view")).toBeTruthy();
    });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./LuxembourgMatriculeView";

describe("LuxembourgMatriculeView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Matricule National"
                value="test-value"
            />,
        );

        const el = document.querySelector(".luxembourg-matricule-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("luxembourg-matricule-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Matricule National"
                value="test-value"
            />,
        );

        const el = document.querySelector(".luxembourg-matricule-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Matricule National" />);

        const el = document.querySelector(".luxembourg-matricule-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Matricule National"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});

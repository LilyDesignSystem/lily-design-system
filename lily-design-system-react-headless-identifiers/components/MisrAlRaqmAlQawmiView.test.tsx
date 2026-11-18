import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./MisrAlRaqmAlQawmiView";

describe("MisrAlRaqmAlQawmiView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="National Number (الرقم القومي)"
                value="test-value"
            />,
        );

        const el = document.querySelector(".misr-al-raqm-al-qawmi-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("misr-al-raqm-al-qawmi-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="National Number (الرقم القومي)"
                value="test-value"
            />,
        );

        const el = document.querySelector(".misr-al-raqm-al-qawmi-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="National Number (الرقم القومي)" />);

        const el = document.querySelector(".misr-al-raqm-al-qawmi-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"National Number (الرقم القومي)"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});

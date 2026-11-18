import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Subject from "./RomaniaPasaportView";

describe("RomaniaPasaportView", () => {
    test("renders with the correct class", () => {
        render(
            <Subject
                label="Romanian Passport"
                value="test-value"
            />,
        );

        const el = document.querySelector(".romania-pasaport-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("romania-pasaport-view");
    });

    test("renders the value as text content", () => {
        render(
            <Subject
                label="Romanian Passport"
                value="test-value"
            />,
        );

        const el = document.querySelector(".romania-pasaport-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(<Subject label="Romanian Passport" />);

        const el = document.querySelector(".romania-pasaport-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Romanian Passport"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});

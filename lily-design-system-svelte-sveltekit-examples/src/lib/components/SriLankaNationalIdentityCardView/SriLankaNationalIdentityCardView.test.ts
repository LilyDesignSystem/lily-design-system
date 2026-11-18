import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SriLankaNationalIdentityCardView.svelte";

describe("SriLankaNationalIdentityCardView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "National Identity Card (NIC) number", value: "test-value" },
        });

        const el = document.querySelector(".sri-lanka-national-identity-card-view") as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("sri-lanka-national-identity-card-view");
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "National Identity Card (NIC) number", value: "test-value" },
        });

        const el = document.querySelector(".sri-lanka-national-identity-card-view") as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "National Identity Card (NIC) number" } });

        const el = document.querySelector(".sri-lanka-national-identity-card-view") as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"National Identity Card (NIC) number"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});

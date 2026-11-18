import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./SingaporeNationalRegistrationIdentityCardView.vue";

describe("SingaporeNationalRegistrationIdentityCardView", () => {
    test("renders with the correct class", () => {
        render(Subject, {
            props: { label: "Singapore National Registration Identity Card", value: "test-value" },
        });

        const el = document.querySelector(
            ".singapore-national-registration-identity-card-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain(
            "singapore-national-registration-identity-card-view",
        );
    });

    test("renders the value as text content", () => {
        render(Subject, {
            props: { label: "Singapore National Registration Identity Card", value: "test-value" },
        });

        const el = document.querySelector(
            ".singapore-national-registration-identity-card-view",
        ) as HTMLElement;
        expect(
            el.textContent?.replace(el.querySelector(".screen-reader-span")?.textContent ?? "", ""),
        ).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Singapore National Registration Identity Card" } });

        const el = document.querySelector(
            ".singapore-national-registration-identity-card-view",
        ) as HTMLElement;
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe(
            `${"Singapore National Registration Identity Card"} `,
        );
        expect(el.hasAttribute("aria-label")).toBe(false);
    });
});

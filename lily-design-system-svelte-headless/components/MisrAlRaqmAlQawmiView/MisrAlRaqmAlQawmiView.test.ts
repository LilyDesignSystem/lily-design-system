import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MisrAlRaqmAlQawmiView.svelte";

describe("MisrAlRaqmAlQawmiView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "الرقم القومي (Al-Raqm Al-Qawmi)", value: "test-value" } });

        const el = screen.getByLabelText("الرقم القومي (Al-Raqm Al-Qawmi)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("misr-al-raqm-al-qawmi-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "الرقم القومي (Al-Raqm Al-Qawmi)", value: "test-value" } });

        const el = screen.getByLabelText("الرقم القومي (Al-Raqm Al-Qawmi)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "الرقم القومي (Al-Raqm Al-Qawmi)" } });

        const el = screen.getByLabelText("الرقم القومي (Al-Raqm Al-Qawmi)");
        expect(el.getAttribute("aria-label")).toBe("الرقم القومي (Al-Raqm Al-Qawmi)");
    });
});

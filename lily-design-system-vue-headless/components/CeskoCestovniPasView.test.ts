import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./CeskoCestovniPasView.vue";

describe("CeskoCestovniPasView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Czech Passport", value: "test-value" } });

        const el = screen.getByLabelText("Czech Passport");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("cesko-cestovni-pas-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Czech Passport", value: "test-value" } });

        const el = screen.getByLabelText("Czech Passport");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Czech Passport" } });

        const el = screen.getByLabelText("Czech Passport");
        expect(el.getAttribute("aria-label")).toBe("Czech Passport");
    });
});

import { render, screen } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView.vue";

describe("UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Taxpayer Registration Number", value: "test-value" } });

        const el = screen.getByLabelText("Taxpayer Registration Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Taxpayer Registration Number", value: "test-value" } });

        const el = screen.getByLabelText("Taxpayer Registration Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Taxpayer Registration Number" } });

        const el = screen.getByLabelText("Taxpayer Registration Number");
        expect(el.getAttribute("aria-label")).toBe("Taxpayer Registration Number");
    });
});

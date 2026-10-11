import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ChileRolUnicoNacionalView.svelte";

describe("ChileRolUnicoNacionalView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Rol Único Nacional (RUN)", value: "test-value" } });

        const el = screen.getByLabelText("Rol Único Nacional (RUN)");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("chile-rol-unico-nacional-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Rol Único Nacional (RUN)", value: "test-value" } });

        const el = screen.getByLabelText("Rol Único Nacional (RUN)");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Rol Único Nacional (RUN)" } });

        const el = screen.getByLabelText("Rol Único Nacional (RUN)");
        expect(el.getAttribute("aria-label")).toBe("Rol Único Nacional (RUN)");
    });
});

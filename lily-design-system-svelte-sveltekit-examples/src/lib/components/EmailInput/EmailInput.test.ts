import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import EmailInput from "./EmailInput.svelte";

describe("EmailInput", () => {
    test("renders the component", () => {
        render(EmailInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});

import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import PasswordInput from "./PasswordInput.svelte";

describe("PasswordInput", () => {
    test("renders with content", () => {
        render(PasswordInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("password-input");
    });
});

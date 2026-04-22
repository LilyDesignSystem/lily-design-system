import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import PasswordInputOrTextInputDiv from "./PasswordInputOrTextInputDiv.svelte";

describe("PasswordInputOrTextInputDiv", () => {
    test("renders the component", () => {
        render(PasswordInputOrTextInputDiv, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});

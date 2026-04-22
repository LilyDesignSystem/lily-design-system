import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import UnitedStatesSocialSecurityNumberInput from "./UnitedStatesSocialSecurityNumberInput.svelte";

describe("UnitedStatesSocialSecurityNumberInput", () => {
    test("renders the component", () => {
        render(UnitedStatesSocialSecurityNumberInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});

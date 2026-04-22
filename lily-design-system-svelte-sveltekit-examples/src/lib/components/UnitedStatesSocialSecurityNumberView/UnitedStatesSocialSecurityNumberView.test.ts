import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import UnitedStatesSocialSecurityNumberView from "./UnitedStatesSocialSecurityNumberView.svelte";

describe("UnitedStatesSocialSecurityNumberView", () => {
    test("renders the component", () => {
        render(UnitedStatesSocialSecurityNumberView, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});

import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import AddressInput from "./AddressInput.svelte";

describe("AddressInput", () => {
    test("renders the component", () => {
        render(AddressInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});

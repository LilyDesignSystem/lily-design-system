import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DateTimeNowInput from "./DateTimeNowInput.svelte";

describe("DateTimeNowInput", () => {
    test("renders the component", () => {
        render(DateTimeNowInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});

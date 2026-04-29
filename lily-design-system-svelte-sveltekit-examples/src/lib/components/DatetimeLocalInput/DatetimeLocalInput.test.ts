import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DateTimeLocalInput from "./DateTimeLocalInput.svelte";

describe("DateTimeLocalInput", () => {
    test("renders the component", () => {
        render(DateTimeLocalInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});

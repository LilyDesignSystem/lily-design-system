import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import AlertDialog from "./AlertDialog.svelte";

describe("AlertDialog", () => {
    test("renders the component", () => {
        render(AlertDialog, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});

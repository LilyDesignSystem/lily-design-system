import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Dialog from "./Dialog.svelte";

describe("Dialog", () => {
    test("renders the component", () => {
        render(Dialog, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});

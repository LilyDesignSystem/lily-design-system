import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import QrCode from "./QrCode.svelte";

describe("QrCode", () => {
    test("renders the component", () => {
        render(QrCode, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});

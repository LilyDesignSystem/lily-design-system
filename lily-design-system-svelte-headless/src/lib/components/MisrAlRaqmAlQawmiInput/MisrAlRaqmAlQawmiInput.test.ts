import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MisrAlRaqmAlQawmiInput from "./MisrAlRaqmAlQawmiInput.svelte";

describe("MisrAlRaqmAlQawmiInput", () => {
    test("renders with content", () => {
        render(MisrAlRaqmAlQawmiInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("misr-al-raqm-al-qawmi-input");
    });
});

import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MisrAlRaqmAlQawmiView from "./MisrAlRaqmAlQawmiView.svelte";

describe("MisrAlRaqmAlQawmiView", () => {
    test("renders with content", () => {
        render(MisrAlRaqmAlQawmiView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("misr-al-raqm-al-qawmi-view");
    });
});

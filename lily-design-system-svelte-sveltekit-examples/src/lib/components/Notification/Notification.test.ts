import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Notification from "./Notification.svelte";

describe("Notification", () => {
    test("renders the component", () => {
        render(Notification, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
